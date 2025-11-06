# 🚀 Quick Start Guide: API Testing

This guide will help you test the Phase 5 Multi-Agent RCA API in under 5 minutes.

---

## Prerequisites

✅ API dependencies already installed:
- `fastapi==0.104.1`
- `uvicorn[standard]==0.24.0`
- `pydantic==2.5.0`
- `requests` (for testing)

---

## Option 1: Automated Test Suite (Recommended)

### Step 1: Start the API Server

Open a terminal and run:

```bash
cd /Users/omkarthorve/Desktop/poc_RCA/phase5_agentic_reasoning/api
python rca_api.py
```

**Expected Output:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Step 2: Run Comprehensive Tests

Open a **NEW terminal** (keep the server running) and run:

```bash
cd /Users/omkarthorve/Desktop/poc_RCA/phase5_agentic_reasoning/api
python test_api_comprehensive.py
```

**Expected Output:**
```
==================================================
🧪 API COMPREHENSIVE TEST SUITE
==================================================
Base URL: http://localhost:8000

ℹ️  Test 1: Root Endpoint
   Testing basic connectivity...
✅ Test 1 PASSED: Root endpoint returned welcome message

ℹ️  Test 2: Health Check
   Checking all agents status...
✅ Test 2 PASSED: All agents are available

ℹ️  Test 3: RCA Workflow
   Submitting test anomaly...
   ⏳ Polling status (attempt 1/40)...
   ⏳ Polling status (attempt 2/40)...
   ...
   ✅ Workflow completed!
   Root Cause: [Identified cause]
   Confidence: 0.XX
✅ Test 3 PASSED: RCA workflow completed successfully

ℹ️  Test 4: Feedback Submission
   Submitting operator feedback...
✅ Test 4 PASSED: Feedback submitted successfully

ℹ️  Test 5: Error Handling
   Testing 404 error...
   Testing 422 validation error...
   Testing 400 bad request...
✅ Test 5 PASSED: All errors handled correctly

==================================================
📊 TEST SUMMARY
==================================================
Total Tests: 5
Passed: 5 ✅
Failed: 0 ❌
Success Rate: 100.0%
Duration: ~90-120 seconds
```

### Duration

- Server startup: ~2 seconds
- Test execution: ~90-120 seconds (includes one full RCA workflow)
- Total: **~2 minutes**

---

## Option 2: Manual Testing via Swagger UI

### Step 1: Start the API Server

```bash
cd /Users/omkarthorve/Desktop/poc_RCA/phase5_agentic_reasoning/api
python rca_api.py
```

### Step 2: Open Swagger UI

Open your browser and navigate to:

```
http://localhost:8000/docs
```

### Step 3: Test Endpoints Manually

#### A. Test Root Endpoint

1. Click on `GET /`
2. Click "Try it out"
3. Click "Execute"
4. Should see: `{"message": "Multi-Agent RCA API", "status": "active"}`

#### B. Test Health Check

1. Click on `GET /api/agents/health`
2. Click "Try it out"
3. Click "Execute"
4. Should see all agents with `"available": true`

#### C. Submit RCA Workflow

1. Click on `POST /api/rca/analyze`
2. Click "Try it out"
3. Use this test payload:

```json
{
  "anomaly_id": "test_anomaly_001",
  "reconstruction_error": 0.3892,
  "dataset": "AI4I",
  "feature_values": {
    "air_temperature_k": 302.5,
    "process_temperature_k": 315.8,
    "rotational_speed_rpm": 1650,
    "torque_nm": 45.2,
    "tool_wear_min": 180
  },
  "timestamp": "2024-11-06T10:30:00",
  "metadata": {}
}
```

4. Click "Execute"
5. Copy the `workflow_id` from the response

#### D. Check Workflow Status

1. Click on `GET /api/rca/status/{workflow_id}`
2. Click "Try it out"
3. Paste your `workflow_id`
4. Click "Execute"
5. Repeat until status is "completed" (~60-90 seconds)

#### E. Get Results

1. Click on `GET /api/rca/result/{workflow_id}`
2. Click "Try it out"
3. Paste your `workflow_id`
4. Click "Execute"
5. View complete RCA analysis

#### F. Submit Feedback

1. Click on `POST /api/rca/feedback`
2. Click "Try it out"
3. Use this payload:

```json
{
  "workflow_id": "<your_workflow_id>",
  "anomaly_id": "test_anomaly_001",
  "is_correct": true,
  "operator_comments": "Diagnosis was accurate",
  "actual_root_cause": null,
  "confidence_rating": 5
}
```

4. Click "Execute"
5. Should see confirmation and learning updates

---

## Option 3: Python Client Example

### Use the Sample Client

```bash
cd /Users/omkarthorve/Desktop/poc_RCA/phase5_agentic_reasoning/api
python test_client.py
```

**What it does:**
1. Submits a test anomaly
2. Polls for completion
3. Retrieves and displays results
4. Shows all diagnostic, reasoning, and planning outputs

---

## Expected Test Results

### Test 1: Root Endpoint
- ✅ Status Code: 200
- ✅ Response: `{"message": "Multi-Agent RCA API", "status": "active"}`

### Test 2: Health Check
- ✅ Status Code: 200
- ✅ All agents available: `diagnostic`, `reasoning`, `planning`, `learning`
- ✅ Tool counts: 4 tools available

### Test 3: RCA Workflow
- ✅ Submission: Status Code 200, returns `workflow_id`
- ✅ Status: Initially "processing", then "completed"
- ✅ Result: Complete analysis with:
  - Root cause identified
  - Confidence scores (0.85-0.95 expected)
  - Recommended actions (5-7 actions)
  - Severity level (high/critical)

### Test 4: Feedback Submission
- ✅ Status Code: 200
- ✅ Learning updates generated (1-3 updates)
- ✅ Confidence adjustments calculated

### Test 5: Error Handling
- ✅ 404: Invalid workflow_id returns proper error
- ✅ 422: Invalid payload returns validation error
- ✅ 400: Malformed request handled gracefully

---

## Troubleshooting

### Server Won't Start

**Problem:** Port 8000 already in use

**Solution:**
```bash
# Find process using port 8000
lsof -ti:8000

# Kill the process
kill -9 <PID>

# Or use a different port
uvicorn rca_api:app --host 0.0.0.0 --port 8001
```

### Test Suite Can't Connect

**Problem:** Connection refused

**Solutions:**
1. Make sure server is running
2. Check URL: `http://localhost:8000` (not https)
3. Verify firewall settings

### Workflow Times Out

**Problem:** Status never becomes "completed"

**Reasons:**
1. Google API key issue (check environment variable)
2. LangGraph error (check server logs)
3. Knowledge graph files missing

**Solution:**
```bash
# Check server terminal for error messages
# Look for lines starting with "ERROR:"
```

---

## Performance Benchmarks

Based on extended testing with 13 anomalies:

| Metric | Expected Value |
|--------|----------------|
| **Submission Time** | <1 second |
| **Processing Time** | 60-90 seconds |
| **Average Confidence** | 0.87 |
| **Success Rate** | 100% |
| **Actions Generated** | 5-9 (avg: 6.2) |

---

## API Endpoints Reference

| Method | Endpoint | Purpose | Duration |
|--------|----------|---------|----------|
| `GET` | `/` | Root/health | <0.1s |
| `GET` | `/api/agents/health` | Agent status | <0.1s |
| `POST` | `/api/rca/analyze` | Submit anomaly | <1s |
| `GET` | `/api/rca/status/{id}` | Check progress | <0.1s |
| `GET` | `/api/rca/result/{id}` | Get results | <0.1s |
| `POST` | `/api/rca/feedback` | Learning update | 1-2s |

---

## Quick Commands Cheat Sheet

```bash
# Start server
cd /Users/omkarthorve/Desktop/poc_RCA/phase5_agentic_reasoning/api
python rca_api.py

# New terminal - run tests
python test_api_comprehensive.py

# New terminal - run sample client
python test_client.py

# Stop server
# Press CTRL+C in server terminal

# View server logs
# Check the terminal where rca_api.py is running

# Access Swagger UI
# Open: http://localhost:8000/docs

# Access ReDoc
# Open: http://localhost:8000/redoc
```

---

## Need Help?

### Check These Files

1. **API Documentation:** `api/README.md`
2. **Test Suite Code:** `api/test_api_comprehensive.py`
3. **Sample Client:** `api/test_client.py`
4. **API Server:** `api/rca_api.py`

### Common Issues

**Q: "ModuleNotFoundError: No module named 'fastapi'"**  
A: Run `pip install -r api/requirements.txt`

**Q: "GOOGLE_API_KEY not found"**  
A: Set environment variable or add to `.env` file

**Q: "Workflow stays in 'processing' forever"**  
A: Check server logs for LangGraph errors

**Q: "All tests fail with connection error"**  
A: Make sure API server is running first

---

## Success Criteria

Your API is working correctly if:

1. ✅ Server starts without errors
2. ✅ All 5 tests pass in test suite
3. ✅ Swagger UI is accessible
4. ✅ Test workflow completes in 60-90 seconds
5. ✅ Results contain valid root cause and actions
6. ✅ Feedback triggers learning updates

---

**Ready to test? Start with Option 1 (Automated Test Suite) - it's the fastest way to validate everything works!**
