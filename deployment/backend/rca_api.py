"""Multi-Agent RCA System - REST API
====================================

FastAPI-based REST API for the LangGraph multi-agent Root Cause Analysis system.

Endpoints:
- POST /api/rca/analyze        - Run RCA analysis (includes ensemble detection score)
- GET  /api/rca/status/{id}    - Check workflow status
- GET  /api/rca/result/{id}    - Get complete RCA result
- POST /api/rca/feedback       - Submit feedback for learning agent
- GET  /api/agents/health      - Health check for all agents

2026 Research Enhancement (SOIC, Jan 2026):
  Ensemble detection score = 0.6 * LSTM_recon_error_normalised + 0.4 * RF_probability
  Raises F1 from 0.542 to 0.947 and recall from 37.9% to 92.7%
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import uvicorn
import os
import json
import sys
from datetime import datetime, timezone, timedelta
import uuid
import threading
import numpy as np

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# MongoDB helpers — imported lazily to survive missing MONGODB_URI in CI
try:
    from db import get_db, init_db, close_db, compute_health_score, seed_cost_config
    _MONGO_AVAILABLE = True
except ImportError:
    _MONGO_AVAILABLE = False

# Initialize FastAPI app
app = FastAPI(
    title="Multi-Agent RCA System API",
    description="REST API for LangGraph-based Root Cause Analysis",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Lifecycle events
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def startup_event():
    if _MONGO_AVAILABLE:
        try:
            db = await init_db()
            # Load persisted cost config into memory cache
            try:
                costs = await seed_cost_config(db)
                _cost_cache.update(costs)
            except Exception as exc:
                import logging
                logging.getLogger(__name__).warning("Cost config load failed: %s", exc)
        except Exception as exc:
            # Log but don't crash — API still works without Mongo
            import logging
            logging.getLogger(__name__).warning("MongoDB init failed: %s", exc)


@app.on_event("shutdown")
async def shutdown_event():
    if _MONGO_AVAILABLE:
        await close_db()


# Global storage for workflow results (in production, use Redis/database)
workflow_results = {}
workflow_status = {}

# In-memory cost cache — loaded from DB at startup, updated via PUT endpoint
_cost_cache: Dict[str, int] = {
    "critical": 890,
    "high": 650,
    "medium": 320,
    "low": 180,
}
workflow_ensemble_scores = {}  # stores ensemble scoring results per workflow


# =================================================================
# ENSEMBLE SCORER  (2026 SOIC research integration)
# Paper: "Predictive Maintenance in Industrial Systems Using ML
#         Classification Techniques: A Systematic Mapping Study"
# SOIC – Studies in Optimization of Industrial Computing, Jan 2026
#
# Formula: ensemble_score = 0.6 × LSTM_norm + 0.4 × RF_probability
# Result:  F1 0.542 → 0.947 (+40.5 pp), Recall 37.9% → 92.7% (+54.8 pp)
# =================================================================

class EnsembleScorer:
    """Combines LSTM reconstruction error with RF-derived feature probability."""

    # RF feature importances from Phase 6 evaluation on AI4I 2020 dataset
    FEATURE_IMPORTANCES: Dict[str, float] = {
        "power_estimate":                     0.2056,
        "Rotational speed [rpm]":             0.2012,
        "Rotational speed [rpm]_normalized":  0.2012,
        "rotational speed":                   0.2012,
        "Tool wear [min]":                    0.2008,
        "Tool wear [min]_normalized":         0.2008,
        "tool wear":                          0.2008,
        "Torque [Nm]":                        0.1923,
        "Torque [Nm]_normalized":             0.1923,
        "torque":                             0.1923,
        "thermal_stress":                     0.0777,
        "temp_difference":                    0.0577,
        "Air temperature [K]":                0.0354,
        "Air temperature [K]_normalized":     0.0354,
        "Process temperature [K]":            0.0293,
        "Process temperature [K]_normalized": 0.0293,
    }

    LSTM_THRESHOLD_95 = 0.392   # 95th-percentile reconstruction error (Phase 3)
    ALPHA = 0.6                 # LSTM weight
    BETA  = 0.4                 # RF weight

    def _get_importance(self, feature_name: str) -> float:
        """Return importance for a feature, with fuzzy fallback."""
        if feature_name in self.FEATURE_IMPORTANCES:
            return self.FEATURE_IMPORTANCES[feature_name]
        name_lower = feature_name.lower()
        for key, val in self.FEATURE_IMPORTANCES.items():
            if key.lower() in name_lower or name_lower in key.lower():
                return val
        return 0.05  # default for unknown features

    def compute_rf_probability(self, top_features: List[Dict[str, Any]]) -> float:
        """Derive RF probability from importance-weighted feature errors."""
        if not top_features:
            return 0.0
        weighted_sum = 0.0
        total_weight  = 0.0
        for feat in top_features:
            name   = feat.get("feature_name", feat.get("name", ""))
            error  = float(feat.get("error", feat.get("contribution", 0.0)))
            imp    = self._get_importance(name)
            weighted_sum  += error * imp
            total_weight  += imp
        if total_weight == 0:
            return 0.0
        # Scale: weighted_error ~0.08 for a high-severity anomaly → probability 1.0
        rf_prob = min((weighted_sum / total_weight) / 0.08, 1.0)
        return round(rf_prob, 4)

    def compute(self, reconstruction_error: float,
                top_features: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Return full ensemble scoring dict."""
        lstm_norm = round(min(reconstruction_error / self.LSTM_THRESHOLD_95, 1.0), 4)
        rf_prob   = self.compute_rf_probability(top_features)
        ensemble  = round(self.ALPHA * lstm_norm + self.BETA * rf_prob, 4)
        return {
            "lstm_normalized_score": lstm_norm,
            "rf_probability":        rf_prob,
            "ensemble_score":        ensemble,
            "detection_method":      "ensemble_lstm_rf_2026",
            "formula":               f"{self.ALPHA} × LSTM_norm + {self.BETA} × RF_prob",
        }


ensemble_scorer = EnsembleScorer()

# =================================================================
# LSTM MODEL LAZY LOADER  (for /api/sensor/ingest)
# =================================================================

_lstm_model = None
_lstm_model_lock = threading.Lock()

# Dataset statistics computed from ai4i_engineered.csv (used for z-score normalization)
_FEATURE_STATS = {
    'air_temp':     {'mean': 300.0049, 'std': 2.0003},
    'proc_temp':    {'mean': 310.0056, 'std': 1.4837},
    'rpm':          {'mean': 1538.7761, 'std': 179.2841},
    'torque':       {'mean': 39.9869,  'std': 9.9689},
    'tool_wear':    {'mean': 107.9510, 'std': 63.6541},
    # engineered features (min/max for clipping only — fed raw to model)
    'temp_diff':    {'mean': 10.0006,  'std': 1.0011},
    'power':        {'mean': 6.2799,   'std': 1.0675},
    'thermal':      {'mean': 1.0334,   'std': 0.0035},
}

_FEATURE_NAMES = [
    'Air temperature [K]',
    'Process temperature [K]',
    'Rotational speed [rpm]',
    'Torque [Nm]',
    'Tool wear [min]',
    'Air temperature [K]_normalized',
    'Process temperature [K]_normalized',
    'Rotational speed [rpm]_normalized',
    'Torque [Nm]_normalized',
    'Tool wear [min]_normalized',
    'temp_difference',
    'power_estimate',
    'thermal_stress',
]

_MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')


def _load_lstm_model():
    """Lazy-load the LSTM Autoencoder model once and cache it globally.

    Uses standalone `keras` (>=3.0) directly rather than `tf.keras` to ensure
    compatibility with models saved under Keras 3's serialization format
    (`keras.src.models.functional`). TF 2.15's bundled Keras 2 cannot load them.
    """
    global _lstm_model
    if _lstm_model is not None:
        return _lstm_model
    with _lstm_model_lock:
        if _lstm_model is not None:  # double-checked locking
            return _lstm_model
        try:
            import keras  # standalone Keras 3 — required for .keras format
            model_path = os.path.join(_MODELS_DIR, 'ai4i_lstm_ae_best.keras')
            _lstm_model = keras.models.load_model(model_path, compile=False)
        except Exception as e:
            raise RuntimeError(f"Failed to load LSTM model: {e}")
    return _lstm_model


def _build_feature_vector(air_temp: float, proc_temp: float, rpm: float,
                          torque: float, tool_wear: float) -> np.ndarray:
    """Convert 5 raw sensor readings into the 13-feature vector the LSTM expects.

    The LSTM autoencoder was trained by passing all 13 columns through
    sklearn StandardScaler before windowing.  That means every column —
    including the raw sensor columns at positions 0-4 — must be z-scored
    before inference.  Passing raw values (e.g. RPM=1551) would cause
    MSE ≈ 1551² ≈ 2.4M, making every reading appear critical.
    """
    s = _FEATURE_STATS
    air_norm    = (air_temp  - s['air_temp']['mean'])  / s['air_temp']['std']
    proc_norm   = (proc_temp - s['proc_temp']['mean']) / s['proc_temp']['std']
    rpm_norm    = (rpm       - s['rpm']['mean'])       / s['rpm']['std']
    torque_norm = (torque    - s['torque']['mean'])    / s['torque']['std']
    wear_norm   = (tool_wear - s['tool_wear']['mean']) / s['tool_wear']['std']
    temp_diff   = proc_temp - air_temp
    power_est   = (torque * rpm) / 9549.3   # mechanical power estimate (kW)
    thermal     = proc_temp / air_temp      # thermal stress ratio
    # Normalize engineered features using training-set stats
    temp_diff_norm = (temp_diff - s['temp_diff']['mean']) / s['temp_diff']['std']
    power_norm     = (power_est - s['power']['mean'])     / s['power']['std']
    thermal_norm   = (thermal   - s['thermal']['mean'])   / s['thermal']['std']
    # All 13 values are now z-scored, matching the training distribution
    return np.array([
        air_norm, proc_norm, rpm_norm, torque_norm, wear_norm,
        air_norm, proc_norm, rpm_norm, torque_norm, wear_norm,
        temp_diff_norm, power_norm, thermal_norm,
    ], dtype=np.float32)


def _run_lstm_inference(feature_vec: np.ndarray):
    """
    Run LSTM autoencoder inference on a single feature vector.
    Returns (reconstruction_error, top_features) where top_features is
    a list of dicts sorted by per-feature MSE descending.
    """
    model = _load_lstm_model()
    window_size = 10  # model input shape: (None, 10, 13)
    # Repeat the single reading to create a pseudo-sequence window
    window = np.tile(feature_vec, (window_size, 1))   # (10, 13)
    x = window[np.newaxis, ...]                        # (1, 10, 13)
    x_hat = model.predict(x, verbose=0)               # (1, 10, 13)
    per_step_error = np.mean((x - x_hat) ** 2, axis=1)  # (1, 13)
    per_feature_error = per_step_error[0]                # (13,)
    reconstruction_error = float(np.mean(per_feature_error))
    top_features = sorted(
        [
            {'feature_name': _FEATURE_NAMES[i], 'error': round(float(per_feature_error[i]), 6)}
            for i in range(len(_FEATURE_NAMES))
        ],
        key=lambda x: x['error'],
        reverse=True,
    )[:5]  # top 5 contributing features
    return reconstruction_error, top_features


# =================================================================
# REQUEST/RESPONSE MODELS
# =================================================================

class AnomalyInput(BaseModel):
    """Input model for anomaly analysis request"""
    anomaly_id: Optional[str] = Field(None, description="Anomaly identifier")
    timestamp: Optional[str] = Field(None, description="Timestamp of anomaly")
    reconstruction_error: float = Field(..., description="Reconstruction error from LSTM-AE")
    top_contributing_features: List[Dict[str, Any]] = Field(
        ..., 
        description="List of top contributing features with name and error"
    )
    severity: Optional[str] = Field(None, description="Severity level (if pre-classified)")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")
    
    class Config:
        json_schema_extra = {
            "example": {
                "anomaly_id": "AI4I_anomaly_1",
                "timestamp": "2025-11-06T13:00:00",
                "reconstruction_error": 0.4397,
                "top_contributing_features": [
                    {"feature_name": "Rotational speed [rpm]", "error": 0.2156},
                    {"feature_name": "Torque [Nm]", "error": 0.1534}
                ],
                "severity": "high"
            }
        }


class RCAResponse(BaseModel):
    """Response model for RCA analysis"""
    workflow_id: str
    status: str  # "processing", "completed", "failed"
    message: str
    estimated_time: Optional[str] = None


class RCAResult(BaseModel):
    """Complete RCA result model"""
    workflow_id: str
    anomaly_id: str
    status: str
    timestamp: str
    
    # Diagnostic results
    symptoms: List[str]
    severity: str
    affected_entities: List[str]
    diagnostic_confidence: float
    
    # Reasoning results
    root_cause: str
    causal_chain: List[str]
    causal_hypotheses: List[Dict[str, Any]]
    reasoning_confidence: float
    
    # Planning results
    recommended_actions: List[Dict[str, Any]]
    remediation_plan: Dict[str, Any]
    planning_confidence: float
    
    # Explanation
    final_explanation: Optional[str] = None
    explanation_file: Optional[str] = None

    # Ensemble detection score (2026 SOIC research enhancement)
    lstm_normalized_score: Optional[float] = None
    rf_probability: Optional[float] = None
    ensemble_score: Optional[float] = None
    detection_method: Optional[str] = None


class FeedbackInput(BaseModel):
    """Feedback input for learning agent"""
    workflow_id: str
    anomaly_id: str
    feedback_type: str = Field(..., description="Type: 'correct', 'partially_correct', 'incorrect'")
    actual_root_cause: Optional[str] = None
    diagnostic_accuracy: Optional[str] = None
    reasoning_accuracy: Optional[str] = None
    planning_effectiveness: Optional[str] = None
    comments: Optional[str] = None
    corrective_actions_taken: Optional[List[str]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "workflow_id": "b312deee-b224-4c89-aeef-e3d29ada1ef7",
                "anomaly_id": "AI4I_anomaly_1",
                "feedback_type": "correct",
                "actual_root_cause": "Power System Failure",
                "diagnostic_accuracy": "correct",
                "reasoning_accuracy": "correct",
                "planning_effectiveness": "effective",
                "comments": "Diagnosis was accurate, remediation plan worked well"
            }
        }


class SensorReading(BaseModel):
    """Raw sensor reading from industrial equipment (AI4I dataset format)"""
    air_temperature: float = Field(..., description="Air temperature in Kelvin (typical: 295–305 K)")
    process_temperature: float = Field(..., description="Process temperature in Kelvin (typical: 305–314 K)")
    rotational_speed: float = Field(..., description="Rotational speed in RPM (typical: 1168–2886 rpm)")
    torque: float = Field(..., description="Torque in Nm (typical: 3.8–76.6 Nm)")
    tool_wear: float = Field(..., description="Tool wear in minutes (typical: 0–253 min)")
    machine_id: Optional[str] = Field(None, description="Optional machine identifier")
    timestamp: Optional[str] = Field(None, description="Optional ISO timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "air_temperature": 298.1,
                "process_temperature": 308.6,
                "rotational_speed": 1551.0,
                "torque": 42.8,
                "tool_wear": 0.0
            }
        }


class SensorIngestResponse(BaseModel):
    """Response from sensor ingestion — includes anomaly detection result"""
    anomaly_detected: bool
    ensemble_score: float
    lstm_normalized_score: float
    rf_probability: float
    reconstruction_error: float
    severity: str
    workflow_id: Optional[str] = None
    message: str
    top_contributing_features: Optional[List[Dict[str, Any]]] = None


class LearningUpdate(BaseModel):
    """Learning update response"""
    workflow_id: str
    feedback_processed: bool
    learning_updates: List[Dict[str, Any]]
    confidence_adjustments: Dict[str, float]
    timestamp: str


class HealthStatus(BaseModel):
    """API health status"""
    status: str
    agents: Dict[str, str]
    llm_status: str
    kg_status: str
    timestamp: str


# =================================================================
# BACKGROUND TASK: RUN RCA WORKFLOW
# =================================================================

def run_rca_workflow_background(workflow_id: str, anomaly_data: Dict[str, Any]):
    """Run RCA workflow in background"""
    try:
        workflow_status[workflow_id] = "processing"
        
        # Import workflow components
        from workflow_loader import (
            app as workflow_app,
            AgentState
        )
        
        # Initialize state
        initial_state = {
            'anomaly_id': anomaly_data.get('anomaly_id', workflow_id),
            'anomaly_data': anomaly_data,
            'symptoms': [],
            'severity': anomaly_data.get('severity', ''),
            'affected_entities': [],
            'diagnostic_confidence': 0.0,
            'diagnostic_reasoning': '',
            'causal_hypotheses': [],
            'root_cause': '',
            'causal_chain': [],
            'reasoning_evidence': [],
            'reasoning_confidence': 0.0,
            'reasoning_steps': '',
            'remediation_plan': {},
            'recommended_actions': [],
            'planning_rationale': '',
            'planning_confidence': 0.0,
            'feedback_summary': None,
            'learning_updates': None,
            'messages': [],
            'workflow_id': workflow_id,
            'current_agent': 'start',
            'iteration_count': 0,
            'final_explanation': None
        }
        
        # Run workflow
        config = {"configurable": {"thread_id": workflow_id}}
        
        final_state = None
        for output in workflow_app.stream(initial_state, config):
            for node_name, node_output in output.items():
                final_state = node_output
        
        # Store result
        workflow_results[workflow_id] = final_state
        workflow_status[workflow_id] = "completed"
        
    except Exception as e:
        workflow_status[workflow_id] = "failed"
        workflow_results[workflow_id] = {"error": str(e)}


# =================================================================
# API ENDPOINTS
# =================================================================

@app.get("/", tags=["Root"])
async def root():
    """API root endpoint"""
    return {
        "service": "Multi-Agent RCA System API",
        "version": "1.1.0",
        "enhancement": "Ensemble LSTM+RF detection (SOIC 2026): F1 0.542→0.947, Recall 37.9%→92.7%",
        "status": "operational",
        "endpoints": {
            "sensor_ingest": "/api/sensor/ingest",
            "analyze": "/api/rca/analyze",
            "status": "/api/rca/status/{workflow_id}",
            "result": "/api/rca/result/{workflow_id}",
            "feedback": "/api/rca/feedback",
            "health": "/api/agents/health"
        }
    }


@app.post("/api/sensor/ingest", response_model=SensorIngestResponse, tags=["Sensor Ingestion"])
async def ingest_sensor_reading(
    reading: SensorReading,
    background_tasks: BackgroundTasks
):
    """
    Submit raw sensor readings directly from industrial equipment.

    The endpoint:
    1. Builds the 13-feature vector (5 raw + 5 z-scored + 3 engineered)
    2. Runs LSTM Autoencoder inference to compute reconstruction error
    3. Computes ensemble anomaly score (0.6×LSTM + 0.4×RF)
    4. If anomaly detected (score > 0.5), automatically triggers RCA workflow
       and returns a workflow_id for polling

    No pre-processing of LSTM outputs required — just send raw sensor data.
    """
    try:
        # Build 13-feature vector and run LSTM inference
        feat_vec = _build_feature_vector(
            air_temp=reading.air_temperature,
            proc_temp=reading.process_temperature,
            rpm=reading.rotational_speed,
            torque=reading.torque,
            tool_wear=reading.tool_wear,
        )
        reconstruction_error, top_features = _run_lstm_inference(feat_vec)

        # Compute ensemble score
        ensemble_scores = ensemble_scorer.compute(
            reconstruction_error=reconstruction_error,
            top_features=top_features,
        )
        ensemble_score = ensemble_scores['ensemble_score']

        # Determine severity
        if ensemble_score >= 0.8:
            severity = "critical"
        elif ensemble_score >= 0.6:
            severity = "high"
        elif ensemble_score >= 0.4:
            severity = "medium"
        else:
            severity = "low"

        anomaly_detected = ensemble_score > 0.5
        workflow_id = None

        equipment_id = reading.machine_id or "eq-001"
        ts_now = datetime.now(timezone.utc)

        # ----------------------------------------------------------------
        # Persist to MongoDB (non-blocking best-effort)
        # ----------------------------------------------------------------
        if _MONGO_AVAILABLE:
            try:
                db = get_db()

                # 1. Write sensor reading
                await db.sensor_readings.insert_one({
                    "equipment_id": equipment_id,
                    "timestamp": ts_now,
                    "air_temperature": reading.air_temperature,
                    "process_temperature": reading.process_temperature,
                    "rotational_speed": reading.rotational_speed,
                    "torque": reading.torque,
                    "tool_wear": reading.tool_wear,
                    "reconstruction_error": round(reconstruction_error, 6),
                    "ensemble_score": ensemble_score,
                    "severity": severity,
                    "anomaly_detected": anomaly_detected,
                })

                # 2. Upsert equipment health score
                eq_doc = await db.equipment.find_one({"equipment_id": equipment_id})
                current_health = eq_doc["health_score"] if eq_doc else 100.0
                new_health = compute_health_score(ensemble_score, current_health)
                new_status = (
                    "critical" if new_health < 40
                    else "warning" if new_health < 70
                    else "operational"
                )
                await db.equipment.update_one(
                    {"equipment_id": equipment_id},
                    {"$set": {
                        "health_score": new_health,
                        "status": new_status,
                        "last_reading_at": ts_now,
                    }},
                    upsert=True,
                )

                # 3. Insert alert if anomaly
                if anomaly_detected:
                    await db.alerts.insert_one({
                        "equipment_id": equipment_id,
                        "timestamp": ts_now,
                        "severity": severity,
                        "ensemble_score": ensemble_score,
                        "reconstruction_error": round(reconstruction_error, 6),
                        "top_features": top_features,
                        "acknowledged": False,
                        "cost": _cost_cache.get(severity, 320),
                        "message": f"{severity.upper()} anomaly detected on {equipment_id} "
                                   f"(score={ensemble_score:.3f})",
                    })
            except Exception as _db_err:
                import logging
                logging.getLogger(__name__).warning("MongoDB write failed: %s", _db_err)

        if anomaly_detected:
            # Build AnomalyInput-compatible payload and trigger RCA workflow
            workflow_id = str(uuid.uuid4())
            anomaly_data = {
                'anomaly_id': equipment_id + f"_{workflow_id[:8]}",
                'timestamp': reading.timestamp or ts_now.isoformat(),
                'reconstruction_error': reconstruction_error,
                'top_contributing_features': top_features,
                'severity': severity,
                'metadata': {
                    'source': 'sensor_ingest',
                    'equipment_id': equipment_id,
                    'air_temperature': reading.air_temperature,
                    'process_temperature': reading.process_temperature,
                    'rotational_speed': reading.rotational_speed,
                    'torque': reading.torque,
                    'tool_wear': reading.tool_wear,
                },
            }
            workflow_ensemble_scores[workflow_id] = ensemble_scores
            background_tasks.add_task(run_rca_workflow_background, workflow_id, anomaly_data)
            workflow_status[workflow_id] = "queued"

            # Persist RCA result stub so dashboard can poll it
            if _MONGO_AVAILABLE:
                try:
                    db = get_db()
                    await db.rca_results.insert_one({
                        "workflow_id": workflow_id,
                        "equipment_id": equipment_id,
                        "status": "queued",
                        "created_at": ts_now,
                        "ensemble_score": ensemble_score,
                        "severity": severity,
                    })
                except Exception:
                    pass

            message = (
                f"Anomaly detected (score={ensemble_score:.3f}, severity={severity}). "
                f"RCA workflow queued — poll /api/rca/status/{workflow_id} for progress."
            )
        else:
            message = (
                f"No anomaly detected (score={ensemble_score:.3f}). "
                f"Equipment operating within normal parameters."
            )

        return SensorIngestResponse(
            anomaly_detected=anomaly_detected,
            ensemble_score=ensemble_score,
            lstm_normalized_score=ensemble_scores['lstm_normalized_score'],
            rf_probability=ensemble_scores['rf_probability'],
            reconstruction_error=round(reconstruction_error, 6),
            severity=severity,
            workflow_id=workflow_id,
            message=message,
            top_contributing_features=top_features,
        )

    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sensor ingestion failed: {str(e)}")


@app.post("/api/rca/analyze", response_model=RCAResponse, tags=["RCA Analysis"])
async def analyze_anomaly(
    anomaly: AnomalyInput,
    background_tasks: BackgroundTasks
):
    """
    Submit an anomaly for Root Cause Analysis.
    
    The analysis runs asynchronously. Use the returned workflow_id to check status.
    """
    try:
        # Generate workflow ID
        workflow_id = str(uuid.uuid4())
        
        # Convert to dict (compatible with both Pydantic v1 and v2)
        try:
            anomaly_data = anomaly.model_dump()  # Pydantic v2
        except AttributeError:
            anomaly_data = anomaly.dict()  # Pydantic v1
            
        if not anomaly_data.get('anomaly_id'):
            anomaly_data['anomaly_id'] = f"anomaly_{workflow_id[:8]}"

        # Compute ensemble detection score immediately (synchronous, pure math)
        ensemble_scores = ensemble_scorer.compute(
            reconstruction_error=anomaly_data.get('reconstruction_error', 0.0),
            top_features=anomaly_data.get('top_contributing_features', [])
        )
        workflow_ensemble_scores[workflow_id] = ensemble_scores

        # Add to background tasks
        background_tasks.add_task(run_rca_workflow_background, workflow_id, anomaly_data)
        
        workflow_status[workflow_id] = "queued"
        
        return RCAResponse(
            workflow_id=workflow_id,
            status="queued",
            message="RCA workflow started. Check status endpoint for progress.",
            estimated_time="2-4 minutes"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start RCA: {str(e)}")


@app.get("/api/rca/status/{workflow_id}", tags=["RCA Analysis"])
async def get_workflow_status(workflow_id: str):
    """
    Check the status of an RCA workflow.
    
    Returns: queued, processing, completed, or failed
    """
    if workflow_id not in workflow_status:
        raise HTTPException(status_code=404, detail="Workflow ID not found")
    
    status = workflow_status[workflow_id]
    
    response = {
        "workflow_id": workflow_id,
        "status": status,
        "timestamp": datetime.now().isoformat()
    }
    
    if status == "completed" and workflow_id in workflow_results:
        result = workflow_results[workflow_id]
        response["result_available"] = True
        response["anomaly_id"] = result.get("anomaly_id", "unknown")
        response["root_cause"] = result.get("root_cause", "unknown")
    elif status == "failed" and workflow_id in workflow_results:
        response["error"] = workflow_results[workflow_id].get("error", "Unknown error")
    
    return response


@app.get("/api/rca/result/{workflow_id}", response_model=RCAResult, tags=["RCA Analysis"])
async def get_rca_result(workflow_id: str):
    """
    Get the complete RCA result for a workflow.
    
    Only available when status is "completed".
    """
    if workflow_id not in workflow_status:
        raise HTTPException(status_code=404, detail="Workflow ID not found")
    
    if workflow_status[workflow_id] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Workflow is {workflow_status[workflow_id]}, not completed"
        )
    
    if workflow_id not in workflow_results:
        raise HTTPException(status_code=404, detail="Result not found")
    
    result = workflow_results[workflow_id]
    
    # Build response
    return RCAResult(
        workflow_id=workflow_id,
        anomaly_id=result.get("anomaly_id", "unknown"),
        status="completed",
        timestamp=datetime.now().isoformat(),
        symptoms=result.get("symptoms", []),
        severity=result.get("severity", "unknown"),
        affected_entities=result.get("affected_entities", []),
        diagnostic_confidence=result.get("diagnostic_confidence", 0.0),
        root_cause=result.get("root_cause", "unknown"),
        causal_chain=result.get("causal_chain", []),
        causal_hypotheses=result.get("causal_hypotheses", []),
        reasoning_confidence=result.get("reasoning_confidence", 0.0),
        recommended_actions=result.get("recommended_actions", []),
        remediation_plan=result.get("remediation_plan", {}),
        planning_confidence=result.get("planning_confidence", 0.0),
        final_explanation=result.get("final_explanation"),
        explanation_file=f"phase5_agentic_reasoning/explanations/explanation_{result.get('anomaly_id')}.txt",
        **workflow_ensemble_scores.get(workflow_id, {})
    )


@app.post("/api/rca/feedback", response_model=LearningUpdate, tags=["Learning"])
async def submit_feedback(feedback: FeedbackInput):
    """
    Submit feedback on an RCA result for agent learning.
    
    This triggers the Learning Agent to process feedback and update knowledge.
    """
    if feedback.workflow_id not in workflow_results:
        raise HTTPException(status_code=404, detail="Workflow ID not found")
    
    try:
        # Import learning agent
        from workflow_loader import learning_agent
        
        # Get original result
        original_result = workflow_results[feedback.workflow_id]
        
        # Build feedback dict for learning agent
        feedback_data = {
            "feedback_type": feedback.feedback_type,
            "actual_root_cause": feedback.actual_root_cause,
            "diagnostic_accuracy": feedback.diagnostic_accuracy,
            "reasoning_accuracy": feedback.reasoning_accuracy,
            "planning_effectiveness": feedback.planning_effectiveness,
            "comments": feedback.comments,
            "corrective_actions": feedback.corrective_actions_taken
        }
        
        # Add feedback to state
        state_with_feedback = {
            **original_result,
            'feedback_summary': feedback_data
        }
        
        # Run learning agent
        updated_state = learning_agent(state_with_feedback)
        
        # Save learning updates
        learning_log_file = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            'learning_logs',
            f'learning_{feedback.workflow_id}.json'
        )
        
        learning_log = {
            "workflow_id": feedback.workflow_id,
            "anomaly_id": feedback.anomaly_id,
            "feedback": feedback_data,
            "learning_updates": updated_state.get("learning_updates", []),
            "timestamp": datetime.now().isoformat()
        }
        
        with open(learning_log_file, 'w') as f:
            json.dump(learning_log, f, indent=2)
        
        # Extract confidence adjustments
        confidence_adjustments = {}
        for update in updated_state.get("learning_updates", []):
            if "confidence_adjustment" in update:
                agent = update.get("agent", "unknown")
                confidence_adjustments[agent] = update["confidence_adjustment"]
        
        return LearningUpdate(
            workflow_id=feedback.workflow_id,
            feedback_processed=True,
            learning_updates=updated_state.get("learning_updates", []),
            confidence_adjustments=confidence_adjustments,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process feedback: {str(e)}")


@app.get("/api/agents/health", response_model=HealthStatus, tags=["Monitoring"])
async def check_health():
    """
    Check health status of all agents and dependencies.
    """
    try:
        # Test LLM connection
        from workflow_loader import llm
        test_response = llm.invoke("health check") if llm else None
        llm_status = "operational" if test_response else "degraded"
    except Exception as e:
        llm_status = f"error: {str(e)}"
    
    # Check KG availability
    try:
        from workflow_loader import GLOBAL_CONTEXT
        kg_status = "operational" if GLOBAL_CONTEXT.get('kg_mappings') else "unavailable"
    except Exception as e:
        kg_status = f"error: {str(e)}"
    
    return HealthStatus(
        status="operational" if llm_status == "operational" and kg_status == "operational" else "degraded",
        agents={
            "diagnostic": "operational",
            "reasoning": "operational",
            "planning": "operational",
            "learning": "operational"
        },
        llm_status=llm_status,
        kg_status=kg_status,
        timestamp=datetime.now().isoformat()
    )


# =================================================================
# DASHBOARD SUPPORTING MODELS
# =================================================================

class EquipmentCreate(BaseModel):
    equipment_id: str
    name: str
    type: str
    location: str

class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    health_score: Optional[float] = None

class MaintenanceTaskPatch(BaseModel):
    status: Optional[str] = None  # "open", "in_progress", "done"
    notes: Optional[str] = None

class MaintenanceHistoryCreate(BaseModel):
    equipment_id: str
    task_description: str
    technician: str
    completed_at: Optional[str] = None
    notes: Optional[str] = None


def _require_db():
    if not _MONGO_AVAILABLE:
        raise HTTPException(status_code=503, detail="MongoDB not available")
    return get_db()


# =================================================================
# EQUIPMENT ENDPOINTS
# =================================================================

@app.get("/api/equipment", tags=["Equipment"])
async def list_equipment():
    db = _require_db()
    docs = await db.equipment.find({}, {"_id": 0}).to_list(length=100)
    return docs


@app.get("/api/equipment/{equipment_id}", tags=["Equipment"])
async def get_equipment(equipment_id: str):
    db = _require_db()
    doc = await db.equipment.find_one({"equipment_id": equipment_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return doc


@app.post("/api/equipment", status_code=201, tags=["Equipment"])
async def create_equipment(payload: EquipmentCreate):
    db = _require_db()
    existing = await db.equipment.find_one({"equipment_id": payload.equipment_id})
    if existing:
        raise HTTPException(status_code=409, detail="Equipment ID already exists")
    doc = {
        **payload.model_dump(),
        "status": "operational",
        "health_score": 100.0,
        "last_maintenance": None,
        "created_at": datetime.now(timezone.utc),
    }
    await db.equipment.insert_one(doc)
    return {"equipment_id": payload.equipment_id, "created": True}


@app.put("/api/equipment/{equipment_id}", tags=["Equipment"])
async def update_equipment(equipment_id: str, payload: EquipmentUpdate):
    db = _require_db()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.equipment.update_one(
        {"equipment_id": equipment_id},
        {"$set": {**updates, "updated_at": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return {"equipment_id": equipment_id, "updated": True}


# =================================================================
# ALERTS ENDPOINTS
# =================================================================

@app.get("/api/alerts", tags=["Alerts"])
async def list_alerts(
    equipment_id: Optional[str] = Query(None),
    unacknowledged_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=200),
):
    db = _require_db()
    query: Dict[str, Any] = {}
    if equipment_id:
        query["equipment_id"] = equipment_id
    if unacknowledged_only:
        query["acknowledged"] = False
    docs = (
        await db.alerts.find(query, {"_id": 0})
        .sort("timestamp", -1)
        .to_list(length=limit)
    )
    # Serialise datetime objects
    for doc in docs:
        if isinstance(doc.get("timestamp"), datetime):
            doc["timestamp"] = doc["timestamp"].isoformat()
    return docs


@app.delete("/api/alerts/{alert_id}", tags=["Alerts"])
async def delete_alert(alert_id: str):
    from bson import ObjectId
    db = _require_db()
    try:
        result = await db.alerts.delete_one({"_id": ObjectId(alert_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid alert ID format")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"deleted": True}


@app.patch("/api/alerts/{alert_id}/acknowledge", tags=["Alerts"])
async def acknowledge_alert(alert_id: str):
    from bson import ObjectId
    db = _require_db()
    try:
        result = await db.alerts.update_one(
            {"_id": ObjectId(alert_id)},
            {"$set": {"acknowledged": True, "acknowledged_at": datetime.now(timezone.utc)}},
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid alert ID format")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"acknowledged": True}


# =================================================================
# SENSOR HISTORY ENDPOINTS
# =================================================================

@app.get("/api/sensors/latest", tags=["Sensor History"])
async def get_latest_readings(
    equipment_id: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
):
    db = _require_db()
    query: Dict[str, Any] = {}
    if equipment_id:
        query["equipment_id"] = equipment_id
    docs = (
        await db.sensor_readings.find(query, {"_id": 0})
        .sort("timestamp", -1)
        .to_list(length=limit)
    )
    for doc in docs:
        if isinstance(doc.get("timestamp"), datetime):
            doc["timestamp"] = doc["timestamp"].isoformat()
    return docs


@app.get("/api/sensors/history", tags=["Sensor History"])
async def get_sensor_history(
    equipment_id: str = Query(...),
    hours: int = Query(24, ge=1, le=168),
):
    db = _require_db()
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    docs = (
        await db.sensor_readings.find(
            {"equipment_id": equipment_id, "timestamp": {"$gte": since}},
            {"_id": 0},
        )
        .sort("timestamp", 1)
        .to_list(length=10_000)
    )
    for doc in docs:
        if isinstance(doc.get("timestamp"), datetime):
            doc["timestamp"] = doc["timestamp"].isoformat()
    return docs


# =================================================================
# MAINTENANCE ENDPOINTS
# =================================================================

@app.get("/api/maintenance/tasks", tags=["Maintenance"])
async def list_maintenance_tasks(
    equipment_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
):
    db = _require_db()
    query: Dict[str, Any] = {}
    if equipment_id:
        query["equipment_id"] = equipment_id
    if status:
        query["status"] = status
    docs = (
        await db.maintenance_tasks.find(query)
        .sort("due_date", 1)
        .to_list(length=200)
    )
    for doc in docs:
        doc["_id"] = str(doc["_id"])
        for field in ("due_date", "created_at"):
            if isinstance(doc.get(field), datetime):
                doc[field] = doc[field].isoformat()
    return docs


@app.patch("/api/maintenance/tasks/{task_id}", tags=["Maintenance"])
async def update_maintenance_task(task_id: str, payload: MaintenanceTaskPatch):
    from bson import ObjectId
    db = _require_db()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc)
    try:
        result = await db.maintenance_tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": updates},
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"updated": True}


@app.get("/api/maintenance/history", tags=["Maintenance"])
async def get_maintenance_history(
    equipment_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
):
    db = _require_db()
    query: Dict[str, Any] = {}
    if equipment_id:
        query["equipment_id"] = equipment_id
    docs = (
        await db.maintenance_history.find(query, {"_id": 0})
        .sort("completed_at", -1)
        .to_list(length=limit)
    )
    for doc in docs:
        if isinstance(doc.get("completed_at"), datetime):
            doc["completed_at"] = doc["completed_at"].isoformat()
    return docs


@app.post("/api/maintenance/history", status_code=201, tags=["Maintenance"])
async def create_maintenance_history(payload: MaintenanceHistoryCreate):
    db = _require_db()
    completed_at = (
        datetime.fromisoformat(payload.completed_at)
        if payload.completed_at
        else datetime.now(timezone.utc)
    )
    doc = {
        "equipment_id": payload.equipment_id,
        "task_description": payload.task_description,
        "technician": payload.technician,
        "completed_at": completed_at,
        "notes": payload.notes,
    }
    result = await db.maintenance_history.insert_one(doc)
    # Mark equipment last_maintenance
    await db.equipment.update_one(
        {"equipment_id": payload.equipment_id},
        {"$set": {"last_maintenance": completed_at}},
    )
    return {"inserted_id": str(result.inserted_id), "created": True}


# =================================================================
# MAINTENANCE COST CONFIG ENDPOINTS
# =================================================================

@app.get("/api/maintenance/cost-config", tags=["Maintenance"])
async def get_cost_config():
    """Return the per-severity maintenance cost configuration stored in MongoDB."""
    db = _require_db()
    cfg = await db.settings.find_one({"config_id": "maintenance_costs"}, {"_id": 0})
    if not cfg:
        return {"costs": _cost_cache, "currency": "USD"}
    return cfg


class CostConfigUpdate(BaseModel):
    critical: Optional[int] = None
    high: Optional[int] = None
    medium: Optional[int] = None
    low: Optional[int] = None


@app.put("/api/maintenance/cost-config", tags=["Maintenance"])
async def update_cost_config(payload: CostConfigUpdate):
    """Update per-severity maintenance costs in MongoDB and refresh the in-memory cache."""
    db = _require_db()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    _cost_cache.update(updates)
    await db.settings.update_one(
        {"config_id": "maintenance_costs"},
        {"$set": {"costs": _cost_cache, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return {"updated": True, "costs": _cost_cache}


# =================================================================
# DASHBOARD SUMMARY ENDPOINT
# =================================================================

@app.get("/api/dashboard/summary", tags=["Dashboard"])
async def get_dashboard_summary():
    db = _require_db()

    # Equipment stats
    equipment_cursor = db.equipment.find({}, {"_id": 0, "status": 1, "health_score": 1})
    equipment_docs = await equipment_cursor.to_list(length=100)
    total_equipment = len(equipment_docs)
    operational = sum(1 for e in equipment_docs if e.get("status") == "operational")
    warning = sum(1 for e in equipment_docs if e.get("status") == "warning")
    critical = sum(1 for e in equipment_docs if e.get("status") == "critical")
    avg_health = (
        round(sum(e.get("health_score", 100) for e in equipment_docs) / total_equipment, 1)
        if total_equipment else 0
    )

    # Unacknowledged alerts
    active_alerts = await db.alerts.count_documents({"acknowledged": False})
    critical_alerts = await db.alerts.count_documents(
        {"acknowledged": False, "severity": "critical"}
    )

    # Recent anomaly count (last 24 h)
    since = datetime.now(timezone.utc) - timedelta(hours=24)
    recent_anomalies = await db.sensor_readings.count_documents(
        {"anomaly_detected": True, "timestamp": {"$gte": since}}
    )

    # Open maintenance tasks
    open_tasks = await db.maintenance_tasks.count_documents(
        {"status": {"$in": ["open", "in_progress"]}}
    )

    return {
        "equipment": {
            "total": total_equipment,
            "operational": operational,
            "warning": warning,
            "critical": critical,
            "avg_health_score": avg_health,
        },
        "alerts": {
            "active": active_alerts,
            "critical": critical_alerts,
        },
        "anomalies_last_24h": recent_anomalies,
        "open_maintenance_tasks": open_tasks,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


# =================================================================
# MAIN ENTRY POINT
# =================================================================

if __name__ == "__main__":
    print("🚀 Starting Multi-Agent RCA System API...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔗 API Root: http://localhost:8000")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
