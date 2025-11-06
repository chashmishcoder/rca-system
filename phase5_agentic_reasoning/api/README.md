# Multi-Agent RCA System - REST API

## Overview

FastAPI-based REST API for the LangGraph multi-agent Root Cause Analysis system.

## Features

- **Asynchronous RCA Analysis**: Submit anomalies for analysis via REST API
- **Status Tracking**: Monitor workflow progress in real-time
- **Results Retrieval**: Get comprehensive RCA results including explanations
- **Feedback Loop**: Submit feedback to trigger Learning Agent
- **Health Monitoring**: Check agent and system health

## Installation

```bash
cd phase5_agentic_reasoning/api
pip install -r requirements.txt
```

## Running the API

```bash
python rca_api.py
```

The API will start on `http://localhost:8000`

- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc (ReDoc)

## API Endpoints

### 1. Analyze Anomaly

**POST** `/api/rca/analyze`

Submit an anomaly for Root Cause Analysis.

**Request Body:**
```json
{
  "anomaly_id": "AI4I_anomaly_1",
  "timestamp": "2025-11-06T13:00:00",
  "reconstruction_error": 0.4397,
  "top_contributing_features": [
    {"feature_name": "Rotational speed [rpm]", "error": 0.2156},
    {"feature_name": "Torque [Nm]", "error": 0.1534}
  ],
  "severity": "high"
}
```

**Response:**
```json
{
  "workflow_id": "b312deee-b224-4c89-aeef-e3d29ada1ef7",
  "status": "queued",
  "message": "RCA workflow started. Check status endpoint for progress.",
  "estimated_time": "2-4 minutes"
}
```

### 2. Check Status

**GET** `/api/rca/status/{workflow_id}`

Check the status of an RCA workflow.

**Response:**
```json
{
  "workflow_id": "b312deee-b224-4c89-aeef-e3d29ada1ef7",
  "status": "completed",
  "timestamp": "2025-11-06T14:00:00",
  "result_available": true,
  "anomaly_id": "AI4I_anomaly_1",
  "root_cause": "Power System Failure"
}
```

### 3. Get Results

**GET** `/api/rca/result/{workflow_id}`

Get complete RCA results.

**Response:**
```json
{
  "workflow_id": "b312deee-b224-4c89-aeef-e3d29ada1ef7",
  "anomaly_id": "AI4I_anomaly_1",
  "status": "completed",
  "timestamp": "2025-11-06T14:00:00",
  "symptoms": ["Significant deviation in rotational speed", "..."],
  "severity": "high",
  "affected_entities": ["Motor", "Drive Train", "Power Supply"],
  "diagnostic_confidence": 0.90,
  "root_cause": "Power System Failure",
  "causal_chain": ["Power Supply Issue", "Motor Instability", "Speed Deviation"],
  "reasoning_confidence": 0.75,
  "recommended_actions": [
    {
      "action_id": "ACT-001",
      "action_name": "Inspect Power Supply",
      "priority": "critical"
    }
  ],
  "planning_confidence": 0.85,
  "final_explanation": "Full RCA report text...",
  "explanation_file": "phase5_agentic_reasoning/explanations/explanation_AI4I_anomaly_1.txt"
}
```

### 4. Submit Feedback

**POST** `/api/rca/feedback`

Submit feedback to trigger Learning Agent.

**Request Body:**
```json
{
  "workflow_id": "b312deee-b224-4c89-aeef-e3d29ada1ef7",
  "anomaly_id": "AI4I_anomaly_1",
  "feedback_type": "correct",
  "actual_root_cause": "Power System Failure",
  "diagnostic_accuracy": "correct",
  "reasoning_accuracy": "correct",
  "planning_effectiveness": "effective",
  "comments": "Diagnosis was accurate, remediation plan worked well"
}
```

**Response:**
```json
{
  "workflow_id": "b312deee-b224-4c89-aeef-e3d29ada1ef7",
  "feedback_processed": true,
  "learning_updates": [
    {
      "agent": "diagnostic",
      "update_type": "pattern",
      "description": "Reinforced pattern recognition for power failures",
      "confidence_adjustment": 0.05
    }
  ],
  "confidence_adjustments": {
    "diagnostic": 0.05,
    "reasoning": 0.03
  },
  "timestamp": "2025-11-06T14:05:00"
}
```

### 5. Health Check

**GET** `/api/agents/health`

Check system health.

**Response:**
```json
{
  "status": "operational",
  "agents": {
    "diagnostic": "operational",
    "reasoning": "operational",
    "planning": "operational",
    "learning": "operational"
  },
  "llm_status": "operational",
  "kg_status": "operational",
  "timestamp": "2025-11-06T14:00:00"
}
```

## Python Client Example

```python
import requests
import time

# API base URL
BASE_URL = "http://localhost:8000"

# Submit anomaly for analysis
anomaly_data = {
    "anomaly_id": "test_anomaly_1",
    "reconstruction_error": 0.4397,
    "top_contributing_features": [
        {"feature_name": "Rotational speed [rpm]", "error": 0.2156},
        {"feature_name": "Torque [Nm]", "error": 0.1534}
    ],
    "severity": "high"
}

response = requests.post(f"{BASE_URL}/api/rca/analyze", json=anomaly_data)
workflow_id = response.json()["workflow_id"]
print(f"Workflow started: {workflow_id}")

# Poll for completion
while True:
    status = requests.get(f"{BASE_URL}/api/rca/status/{workflow_id}").json()
    print(f"Status: {status['status']}")
    
    if status['status'] == 'completed':
        break
    elif status['status'] == 'failed':
        print(f"Error: {status.get('error')}")
        exit(1)
    
    time.sleep(10)

# Get results
result = requests.get(f"{BASE_URL}/api/rca/result/{workflow_id}").json()
print(f"Root Cause: {result['root_cause']}")
print(f"Confidence: {result['reasoning_confidence']}")
print(f"Actions: {len(result['recommended_actions'])}")

# Submit feedback
feedback = {
    "workflow_id": workflow_id,
    "anomaly_id": result['anomaly_id'],
    "feedback_type": "correct",
    "diagnostic_accuracy": "correct",
    "reasoning_accuracy": "correct",
    "planning_effectiveness": "effective",
    "comments": "Great analysis!"
}

learning = requests.post(f"{BASE_URL}/api/rca/feedback", json=feedback).json()
print(f"Learning updates: {len(learning['learning_updates'])}")
```

## cURL Examples

### Analyze Anomaly
```bash
curl -X POST "http://localhost:8000/api/rca/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "reconstruction_error": 0.4397,
    "top_contributing_features": [
      {"feature_name": "Rotational speed [rpm]", "error": 0.2156}
    ]
  }'
```

### Check Status
```bash
curl "http://localhost:8000/api/rca/status/WORKFLOW_ID"
```

### Get Result
```bash
curl "http://localhost:8000/api/rca/result/WORKFLOW_ID"
```

### Health Check
```bash
curl "http://localhost:8000/api/agents/health"
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   REST API Layer                    │
│                    (FastAPI)                        │
├─────────────────────────────────────────────────────┤
│  POST /analyze  │  GET /status  │  POST /feedback  │
└────────┬─────────────────┬─────────────┬───────────┘
         │                 │             │
         ▼                 ▼             ▼
┌─────────────────────────────────────────────────────┐
│              LangGraph Workflow Engine              │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Diagnostic│→ │Reasoning │→ │Planning  │        │
│  │  Agent   │  │  Agent   │  │  Agent   │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                    ↓               │
│                             ┌──────────┐          │
│                             │ Learning │          │
│                             │  Agent   │          │
│                             └──────────┘          │
└─────────────────────────────────────────────────────┘
         │                 │             │
         ▼                 ▼             ▼
┌─────────────┐  ┌──────────────┐  ┌───────────┐
│  Gemini LLM │  │ Knowledge    │  │   SWRL    │
│  (Reasoning)│  │  Graph (KG)  │  │   Rules   │
└─────────────┘  └──────────────┘  └───────────┘
```

## Error Handling

The API returns standard HTTP status codes:

- **200**: Success
- **400**: Bad Request (workflow not completed, invalid input)
- **404**: Not Found (workflow ID doesn't exist)
- **500**: Internal Server Error (agent failure, LLM error)

## Performance

- **Average RCA Time**: 2-4 minutes per anomaly
- **Concurrent Workflows**: Supported via background tasks
- **Result Storage**: In-memory (use Redis/database for production)

## Production Deployment

For production deployment:

1. **Use Redis** for workflow state storage
2. **Add authentication** (JWT, API keys)
3. **Implement rate limiting**
4. **Add logging and monitoring** (Prometheus, Grafana)
5. **Deploy with Docker** + Kubernetes
6. **Use HTTPS** with proper certificates

## License

Part of the Phase 5 Multi-Agent RCA System
