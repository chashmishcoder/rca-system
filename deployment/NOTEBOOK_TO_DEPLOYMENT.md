# 📓 From Jupyter Notebooks to Deployed Web App

## 🤔 "All my code is in Jupyter notebooks - How does this work?"

**Great news: You ALREADY did the hard work in Phase 5!** 🎉

## 📊 What You Have in Notebooks

### Phase 1-4 Notebooks:
```
EDA_ai4i.ipynb                     → Data exploration
Anomaly detection & ...ipynb       → Model training
phase2_kg.ipynb                    → Knowledge graph
phase4_KG_embedding...ipynb        → Embeddings
```

These notebooks:
- ✅ Trained your models
- ✅ Created knowledge graph
- ✅ Generated embeddings
- ✅ Saved everything to files

### Phase 5 Notebook:
```
phase5_langgraph_agentic_reasoning.ipynb
```

This notebook:
- ✅ Created LangGraph workflow
- ✅ Built 4 specialized agents
- ✅ **CONVERTED to Python API** ← Key point!

## 🔄 The Conversion (Already Done!)

Look at your Phase 5 structure:

```
phase5_agentic_reasoning/
│
├── phase5_langgraph...ipynb    ← Your notebook
│
├── agents/                      ← Extracted agent code
│   ├── root_cause_agent.py
│   ├── hypothesis_agent.py
│   └── ...
│
└── api/                         ← Extracted API code ✨
    ├── rca_api.py              ← FastAPI server (477 lines!)
    ├── requirements.txt         ← Dependencies
    └── workflow_loader.py       ← Loads your workflow
```

**You already extracted your notebook code into Python modules!**

## 🎯 How Deployment Works

### Step 1: Setup Script Copies Everything

```bash
./deployment/setup.sh
```

This copies:
```
phase5_agentic_reasoning/api/rca_api.py
    → deployment/backend/rca_api.py

phase3_anomaly_detection/models/*.keras
    → deployment/backend/models/

knowledge_graph/*
    → deployment/backend/knowledge_graph/

phase4_kg_embeddings/embeddings/*
    → deployment/backend/embeddings/
```

### Step 2: Backend Uses Your Saved Artifacts

The `rca_api.py` server:
1. **Loads your trained models** (saved from Phase 3 notebook)
2. **Connects to Neo4j** (knowledge graph from Phase 2)
3. **Uses embeddings** (generated in Phase 4)
4. **Runs LangGraph workflow** (created in Phase 5)

**It uses the OUTPUT of your notebooks, not the notebooks themselves!**

### Step 3: Frontend Provides Beautiful Interface

```
Notebook → Saved Model → API → Beautiful UI
```

Instead of:
```python
# In Jupyter
result = analyze_anomaly("AI4I_anomaly_0")
print(result)
```

Users get:
```
[Beautiful Web Form]
Anomaly ID: [AI4I_anomaly_0] [Analyze]

→ Analyzing... 🔄

→ Results:
  Root Cause: High Tool Wear
  Confidence: 86%
  Explanation: ...
```

## 🔍 Let's Verify Your Setup

### Check 1: Do you have the API?
```bash
ls -la phase5_agentic_reasoning/api/rca_api.py
```
✅ **You have this!** (477 lines)

### Check 2: Do you have trained models?
```bash
ls -la phase3_anomaly_detection/models/
```
Expected: `.keras` files from your anomaly detection notebook

### Check 3: Do you have knowledge graph data?
```bash
ls -la knowledge_graph/
```
Expected: OWL ontology, mappings, rules

### Check 4: Can your API run locally?
```bash
cd phase5_agentic_reasoning/api
python -m uvicorn rca_api:app --reload
```
Expected: Server starts on http://localhost:8000

## 🎭 Demo Flow - What Teachers See

### Without Deployment (Current):
1. Teacher: "Show me your project"
2. You: *Opens Jupyter notebook*
3. You: *Runs cells, explains code*
4. Teacher: "Hmm, looks technical..."

### With Deployment (Tomorrow):
1. Teacher: "Show me your project"
2. You: *Opens browser* → `https://your-rca-system.onrender.com`
3. Teacher sees: **Beautiful professional interface**
4. You: *Types anomaly ID, clicks Analyze*
5. System: *Shows results in real-time*
6. Teacher: "Wow! This is production-ready!" 🌟

## 🧩 Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│  Phase 1-4 Notebooks (Training)                 │
│  ├─ Data preprocessing                          │
│  ├─ Model training                              │
│  ├─ Knowledge graph creation                    │
│  └─ Embeddings generation                       │
└────────────┬────────────────────────────────────┘
             │ Saves artifacts
             ↓
┌─────────────────────────────────────────────────┐
│  Saved Files (Used by API)                      │
│  ├─ models/*.keras                              │
│  ├─ knowledge_graph/*.owl                       │
│  ├─ embeddings/*.npy                            │
│  └─ processed_data/*.csv                        │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  Phase 5 Notebook → Python API                  │
│  ├─ LangGraph workflow → workflow_loader.py     │
│  ├─ Agents → agents/*.py                        │
│  └─ API endpoints → rca_api.py                  │
└────────────┬────────────────────────────────────┘
             │ Deployed to Render.com
             ↓
┌─────────────────────────────────────────────────┐
│  FastAPI Backend (Cloud)                        │
│  ├─ Loads models                                │
│  ├─ Connects to Neo4j                           │
│  ├─ Runs agents                                 │
│  └─ Returns results                             │
└────────────┬────────────────────────────────────┘
             │ JSON API
             ↓
┌─────────────────────────────────────────────────┐
│  React Frontend (Cloud)                         │
│  ├─ Beautiful UI                                │
│  ├─ Form inputs                                 │
│  └─ Results display                             │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  Your Teachers (Browser)                        │
│  "This looks professional!" 🎓                  │
└─────────────────────────────────────────────────┘
```

## ✅ Action Plan - What To Do Now

### 1. Verify You Have All Artifacts (5 mins)

```bash
# Check trained models exist
ls phase3_anomaly_detection/models/

# Check knowledge graph exists
ls knowledge_graph/

# Check API exists
ls phase5_agentic_reasoning/api/rca_api.py

# Check embeddings exist (if you use them)
ls phase4_kg_embeddings/embeddings/
```

### 2. Test API Locally (Optional - 5 mins)

```bash
cd phase5_agentic_reasoning/api

# Start server
python -m uvicorn rca_api:app --reload --port 8000

# In another terminal, test it
curl http://localhost:8000/api/agents/health
```

### 3. Run Setup Script (5 mins)

```bash
cd /Users/omkarthorve/Desktop/poc_RCA
./deployment/setup.sh
```

This copies everything to `deployment/` folder.

### 4. Follow QUICK_START.md (50 mins)

The setup script prepared everything. Now just:
- Push to GitHub
- Deploy to Render.com
- Done!

## 🤓 Technical Details

### What Gets Deployed:

**Backend (`deployment/backend/`)**:
```python
# rca_api.py
from fastapi import FastAPI

@app.post("/api/rca/analyze")
async def analyze_anomaly(anomaly_id: str):
    # 1. Load model (from Phase 3 notebook output)
    model = load_model("models/anomaly_detector.keras")
    
    # 2. Query KG (from Phase 2 notebook output)
    kg_context = query_neo4j(anomaly_id)
    
    # 3. Run agents (from Phase 5 notebook logic)
    result = run_langgraph_workflow(anomaly_id, kg_context)
    
    return result
```

**Frontend (`deployment/frontend/`)**:
```javascript
// analyze/page.tsx
const handleAnalyze = async () => {
  const response = await axios.post(
    `${API_URL}/api/rca/analyze`,
    { anomaly_id: anomalyId }
  );
  setResult(response.data);
};
```

### What Doesn't Get Deployed:

❌ Jupyter notebooks themselves
❌ Training code (already trained!)
❌ EDA visualizations (already done!)
✅ Only inference code + saved models

## 🎉 Why This Works

### Notebooks Are For:
- ✅ Experimentation
- ✅ Training models
- ✅ Data exploration
- ✅ Research & development

### APIs Are For:
- ✅ Production inference
- ✅ Real-time analysis
- ✅ Web integration
- ✅ User-facing applications

### You Did Both! 🏆

- **Notebooks** → Research & training (Phases 1-5)
- **API** → Production deployment (Phase 5 API)
- **Frontend** → User interface (Now!)

## 🆘 Common Questions

### Q: "Do I need to convert all notebooks to Python?"
**A:** No! You already did this for Phase 5. Other notebooks just trained models/created data.

### Q: "Will my notebooks still work?"
**A:** Yes! They're separate. Keep them for experiments.

### Q: "What if I want to retrain models?"
**A:** Run notebooks → Save new models → Copy to `deployment/backend/models/` → Redeploy

### Q: "Can I show notebooks to teachers too?"
**A:** Absolutely! Show both:
1. Web app (production system)
2. Notebooks (how you built it)

### Q: "What if API breaks during demo?"
**A:** Run notebooks locally as backup! See `QUICK_START.md` backup plan.

## 🚀 Ready to Deploy?

You understand the flow now:
1. ✅ Notebooks trained models → saved to files
2. ✅ Phase 5 created API → uses those files
3. ✅ Setup script copies everything → ready to deploy
4. ✅ Render.com hosts API → cloud deployment
5. ✅ React frontend → beautiful interface

**Next step: Run `./deployment/setup.sh`**

---

**You're not converting notebooks - you're deploying their OUTPUT! 🎯**
