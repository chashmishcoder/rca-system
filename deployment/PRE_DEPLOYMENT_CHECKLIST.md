# ✅ Pre-Deployment Checklist

## Before Running Setup Script

Check these files exist from your Jupyter notebooks:

### 1. Phase 5 API (REQUIRED) ✨
```bash
ls phase5_agentic_reasoning/api/rca_api.py
```
- ✅ **File exists**: 477 lines of FastAPI code
- ❌ **Missing**: You need to extract API from Phase 5 notebook

### 2. Trained Models (REQUIRED)
```bash
ls phase3_anomaly_detection/models/
```
**Expected files:**
- `anomaly_detector.keras` or similar
- `*.h5` or `*.keras` model files
- `*.pkl` preprocessor files

**If missing:**
- Open `Anomaly detection & feature engineering.ipynb`
- Run cells that save models
- Look for: `model.save('models/...')`

### 3. Knowledge Graph Files (REQUIRED)
```bash
ls knowledge_graph/
```
**Expected:**
- `ontology/predictive_maintenance_ontology.owl`
- `mappings/semantic_mappings.json`
- `rules/*.cypher` or `*.swrl`

**If missing:**
- Open `phase2_kg.ipynb`
- Run cells that export ontology
- Check if files are in different location

### 4. Processed Data (REQUIRED)
```bash
ls processed_data/
```
**Expected:**
- `ai4i_engineered.csv`
- `ai4i_windowed.csv`
- Or similar processed datasets

**If missing:**
- Open preprocessing notebooks
- Run cells that save processed data
- Look for: `df.to_csv('processed_data/...')`

### 5. Embeddings (OPTIONAL)
```bash
ls phase4_kg_embeddings/embeddings/
```
**Expected:**
- `*.npy` or `*.pt` embedding files
- `entity_embeddings.npy`
- `relation_embeddings.npy`

**If missing:**
- Open `phase4_KG_embedding...ipynb`
- Run cells that save embeddings
- Or skip if not using embeddings

### 6. Neo4j Connection (REQUIRED)
**Check your Neo4j credentials:**
```bash
# Do you have Neo4j Aura account?
# Or local Neo4j running?
```

**You'll need:**
- Neo4j URI: `neo4j+s://xxxxx.databases.neo4j.io`
- Username: usually `neo4j`
- Password: your password
- Database populated from Phase 2

### 7. API Keys (REQUIRED)
```bash
# Check if you have Google API key
echo $GOOGLE_API_KEY
```

**If empty:**
- Get key from: https://aistudio.google.com/apikey
- Or use existing key from notebooks

## 🔍 Run This Quick Check Script

```bash
cd /Users/omkarthorve/Desktop/poc_RCA

echo "🔍 Checking deployment prerequisites..."
echo ""

# Check API
if [ -f "phase5_agentic_reasoning/api/rca_api.py" ]; then
    echo "✅ FastAPI code found"
else
    echo "❌ FastAPI code missing - Need to create API from notebook"
fi

# Check models
if [ -d "phase3_anomaly_detection/models" ] && [ "$(ls -A phase3_anomaly_detection/models)" ]; then
    echo "✅ Models directory found with files"
    ls phase3_anomaly_detection/models/ | head -3
else
    echo "❌ Models missing - Need to run Phase 3 notebook and save models"
fi

# Check knowledge graph
if [ -f "knowledge_graph/ontology/predictive_maintenance_ontology.owl" ]; then
    echo "✅ Knowledge graph ontology found"
else
    echo "❌ Knowledge graph missing - Need to run Phase 2 notebook"
fi

# Check processed data
if [ -d "processed_data" ] && [ "$(ls -A processed_data)" ]; then
    echo "✅ Processed data found"
    ls processed_data/*.csv | head -3
else
    echo "❌ Processed data missing - Need to run preprocessing notebooks"
fi

# Check agents
if [ -d "phase5_agentic_reasoning/agents" ]; then
    echo "✅ Agent modules found"
else
    echo "⚠️  Agent modules missing - May need to create from notebook"
fi

echo ""
echo "📊 Summary:"
echo "If all items show ✅, you're ready to run ./deployment/setup.sh"
echo "If any show ❌, you need to run those notebooks first to generate files"
```

## 🚨 Common Issues & Solutions

### Issue 1: "No models found"
**Solution:**
```bash
# Open Phase 3 notebook
jupyter notebook "Anomaly detection & feature engineering.ipynb"

# Find cells like:
model.save('phase3_anomaly_detection/models/anomaly_detector.keras')

# Run those cells
# Verify file created:
ls phase3_anomaly_detection/models/
```

### Issue 2: "API file doesn't exist"
**Solution:**

Your Phase 5 notebook should have created this. Check:
```bash
ls phase5_agentic_reasoning/api/
```

If empty, you need to:
1. Open `phase5_langgraph_agentic_reasoning.ipynb`
2. Find cells that create FastAPI app
3. Those should save to `api/rca_api.py`

Or we can extract the API code from your notebook - let me know!

### Issue 3: "Knowledge graph files missing"
**Solution:**
```bash
# Open Phase 2 notebook
jupyter notebook phase2_kg.ipynb

# Find cells with:
# - ontology.save(...)
# - export_to_owl(...)
# - save_mappings(...)

# Run those cells
```

### Issue 4: "No processed data"
**Solution:**
```bash
# Open EDA notebooks
jupyter notebook EDA_ai4i.ipynb

# Find cells with:
# df.to_csv('processed_data/...')

# Run those cells
```

## ✅ Verification Commands

Run these to verify everything:

```bash
# 1. Check API can import
cd phase5_agentic_reasoning/api
python -c "import rca_api; print('✅ API imports successfully')"

# 2. Check models can load
python -c "
import tensorflow as tf
model = tf.keras.models.load_model('../../phase3_anomaly_detection/models/anomaly_detector.keras')
print('✅ Models load successfully')
"

# 3. Check data can load
python -c "
import pandas as pd
df = pd.read_csv('../../processed_data/ai4i_engineered.csv')
print(f'✅ Data loads successfully ({len(df)} rows)')
"

# 4. Check knowledge graph files
python -c "
import json
with open('../../knowledge_graph/mappings/semantic_mappings.json') as f:
    mappings = json.load(f)
print('✅ KG mappings load successfully')
"
```

## 📋 Minimal Requirements for Demo

If time is short, you ONLY need:

### Must Have:
1. ✅ `phase5_agentic_reasoning/api/rca_api.py`
2. ✅ Some test data (can be sample)
3. ✅ API keys (Google Gemini)

### Nice to Have (can mock):
- Models (can use dummy predictions)
- Full Neo4j (can use in-memory)
- All historical data (can use sample)

### Emergency Option:
If files are missing, we can create a **simplified demo API** that:
- Uses sample data
- Simulates RCA logic
- Still shows the frontend beautifully
- Perfect for demo purposes

Would you like me to help check which files you have?

## 🎯 Next Step

Copy and run the check script above, then tell me what's ✅ and what's ❌!

```bash
# Run the check
bash
# Then paste the check commands above
```

I'll help you fix any missing pieces! 🚀
