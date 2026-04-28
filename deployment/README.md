# Deployment

This folder contains the deployable backend API and frontend dashboard for the Agentic Root Cause Diagnostic Advisor system.

## Structure

```
deployment/
├── setup.sh              # One-time local setup script
├── backend/
│   ├── rca_api.py        # FastAPI application (all endpoints)
│   ├── requirements.txt  # Python dependencies
│   ├── Dockerfile        # Container config for Render/Docker
│   ├── render.yaml       # Render.com service config
│   ├── models/           # LSTM .keras model files
│   ├── data/             # Knowledge graph JSON data
│   └── knowledge_graph/  # Ontology, rules, semantic mappings
└── frontend/
    ├── app/
    │   ├── layout.tsx    # Root layout with navbar
    │   ├── page.tsx      # Landing page
    │   └── analyze/
    │       └── page.tsx  # RCA analysis dashboard
    ├── package.json
    └── tailwind.config.js
```

## Backend

**Stack:** FastAPI · Python 3.11 · LangGraph · Google Gemini · Uvicorn

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Service info |
| POST | `/api/rca/analyze` | Submit anomaly for RCA (returns `workflow_id`) |
| GET | `/api/rca/status/{workflow_id}` | Poll workflow status |
| GET | `/api/rca/result/{workflow_id}` | Get full RCA result |
| POST | `/api/rca/feedback` | Submit feedback to learning agent |
| GET | `/api/agents/health` | Health check for all agents |

### Local Setup

```bash
cd deployment/backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Set required env vars
export GOOGLE_API_KEY=your_gemini_api_key   # required
export NEO4J_URI=bolt://localhost:7687      # optional
export NEO4J_USER=neo4j                     # optional
export NEO4J_PASSWORD=your_password         # optional

uvicorn rca_api:app --host 0.0.0.0 --port 8000 --reload
```

API docs available at `http://localhost:8000/docs`

### Render.com Deployment

1. Create a new **Web Service** from the repo root
2. Set **Root Directory** to `deployment/backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn rca_api:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in the Render dashboard:
   - `GOOGLE_API_KEY` (required)
   - `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD` (optional)

## Frontend

**Stack:** Next.js 14 · React 18 · TypeScript · Tailwind CSS · Axios · Recharts

### Local Setup

```bash
cd deployment/frontend
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev   # http://localhost:3000
```

### Render.com / Vercel Deployment

Set environment variable:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

Build command: `npm run build`  
Output directory: `.next`

## Research Note

The backend incorporates a 2026 SOIC ensemble scoring model:

```
ensemble_score = 0.6 × LSTM_normalised + 0.4 × RF_probability
```

This raises anomaly detection F1 from **0.542 → 0.947** and recall from **37.9% → 92.7%**. The score is computed on every `/api/rca/analyze` call and returned in the result payload (`lstm_normalized_score`, `rf_probability`, `ensemble_score`).
