# Agentic Root-Cause Diagnostic Advisor
### AI-Powered Predictive Maintenance using Knowledge Graphs & Multi-Agent LLMs

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org)
[![LangGraph](https://img.shields.io/badge/Agents-LangGraph-orange)](https://langchain-ai.github.io/langgraph/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What is this project?

This system **automatically diagnoses the root cause of industrial equipment failures** in real time. Instead of a maintenance engineer spending 2–4 hours manually tracing sensor logs, this system does it in ~77 seconds by combining:

- **LSTM Autoencoder** — detects anomalies in sensor data with 95.3% precision
- **Knowledge Graph** — stores causal relationships between equipment, failure modes, and symptoms (OWL ontology + SWRL rules)
- **4 Autonomous AI Agents** (powered by Google Gemini via LangGraph) — collaborate to diagnose root causes, generate remediation plans, and learn from operator feedback
- **REST API + Web Dashboard** — exposes the system via FastAPI backend and Next.js frontend

### Key results
| Metric | Value |
|---|---|
| Root cause identification rate | 84.6% |
| Workflow success rate | 100% |
| Avg. diagnosis time | 77 seconds |
| System confidence | 0.87 |
| Cross-domain transfer (AI4I → MetroPT) | 72% zero-shot |

---

## Project Structure

```
rca-system/
├── deployment/
│   ├── backend/
│   │   ├── rca_api.py            # FastAPI server — all endpoints
│   │   ├── workflow_loader.py    # LangGraph multi-agent workflow
│   │   ├── requirements.txt      # Python dependencies
│   │   ├── Dockerfile            # Container for deployment
│   │   ├── render.yaml           # Render.com config
│   │   ├── models/               # Trained LSTM-AE Keras models
│   │   └── knowledge_graph/      # OWL ontology, SWRL rules, semantic mappings
│   └── frontend/
│       ├── app/
│       │   ├── page.tsx          # Landing page
│       │   └── analyze/page.tsx  # RCA analysis dashboard
│       ├── package.json
│       └── tailwind.config.js
└── .gitignore
```

---

## Running Locally

### Prerequisites

| Tool | Version |
|---|---|
| Python | 3.11+ |
| Node.js | 18+ |
| npm | 9+ |

You will also need a **Google Gemini API key** (free tier works):  
→ https://aistudio.google.com/app/apikey

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/chashmishcoder/rca-system.git
cd rca-system
```

---

### Step 2 — Run the Backend

```bash
cd deployment/backend
```

Create a virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

Set your environment variables:

```bash
export GOOGLE_API_KEY="your_gemini_api_key_here"
```

> **Optional — Neo4j (Knowledge Graph database):**  
> The system works without Neo4j by falling back to the bundled JSON/OWL files.  
> If you want live Neo4j, set these too:
> ```bash
> export NEO4J_URI="bolt://localhost:7687"
> export NEO4J_USER="neo4j"
> export NEO4J_PASSWORD="your_password"
> ```

Start the backend server:

```bash
uvicorn rca_api:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at **http://localhost:8000**  
Interactive docs (Swagger UI): **http://localhost:8000/docs**

---

### Step 3 — Run the Frontend

Open a new terminal:

```bash
cd deployment/frontend
npm install
```

The `.env.local` already points to localhost:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

The dashboard will be live at **http://localhost:3000**

---

### Step 4 — Test it

Open **http://localhost:3000** → click **"Analyze"** → enter any anomaly ID (e.g. `AI4I_anomaly_1`) → click **Analyze**.

Or test the API directly:

```bash
curl -X POST http://localhost:8000/api/rca/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "anomaly_id": "AI4I_anomaly_1",
    "timestamp": "2024-11-01T10:00:00",
    "reconstruction_error": 0.44,
    "top_contributing_features": [
      {"feature_name": "Rotational speed [rpm]", "error": 0.22},
      {"feature_name": "Torque [Nm]", "error": 0.15},
      {"feature_name": "Tool wear [min]", "error": 0.07}
    ],
    "severity": "high"
  }'
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/rca/analyze` | Run RCA on an anomaly |
| `GET` | `/api/rca/status/{workflow_id}` | Poll workflow progress |
| `GET` | `/api/rca/result/{workflow_id}` | Fetch completed result |
| `POST` | `/api/rca/feedback` | Submit operator feedback (learning loop) |
| `GET` | `/api/agents/health` | Health check for all agents |

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://rca-frontend-drl9.onrender.com |
| Backend API | https://rca-backend-5jlv.onrender.com |
| API Docs | https://rca-backend-5jlv.onrender.com/docs |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Anomaly Detection | TensorFlow/Keras — LSTM Autoencoder |
| Knowledge Graph | OWL Ontology + SWRL Rules (Owlready2) |
| AI Agents | LangGraph + Google Gemini |
| Backend | FastAPI + Uvicorn |
| Frontend | Next.js 14 + Tailwind CSS + Recharts |
| Deployment | Render.com (Docker) |

---

## License

MIT License — see [LICENSE](LICENSE) for details.
