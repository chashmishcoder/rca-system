"""
Phase 5: Multi-Agent RCA System - REST API
===========================================

FastAPI-based REST API for accessing the LangGraph multi-agent RCA system.

Endpoints:
- POST /api/rca/analyze - Run RCA analysis on an anomaly
- GET /api/rca/status/{workflow_id} - Check workflow status
- GET /api/rca/result/{workflow_id} - Get RCA results
- POST /api/rca/feedback - Submit feedback for learning
- GET /api/agents/health - Health check for all agents
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
import uvicorn
import os
import json
import sys
from datetime import datetime
import uuid

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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

# Global storage for workflow results (in production, use Redis/database)
workflow_results = {}
workflow_status = {}

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
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "analyze": "/api/rca/analyze",
            "status": "/api/rca/status/{workflow_id}",
            "result": "/api/rca/result/{workflow_id}",
            "feedback": "/api/rca/feedback",
            "health": "/api/agents/health"
        }
    }


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
        explanation_file=f"phase5_agentic_reasoning/explanations/explanation_{result.get('anomaly_id')}.txt"
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
