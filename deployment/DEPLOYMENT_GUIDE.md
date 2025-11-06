# 🚀 COMPLETE DEPLOYMENT GUIDE - Free & Ready by Tomorrow

## Time Estimate: 3-4 hours total

## Prerequisites (5 minutes)
- [ ] GitHub account
- [ ] Render.com account (sign up free at render.com)
- [ ] Neo4j Aura account (free at neo4j.com/cloud/aura)
- [ ] Google Gemini API key

---

## STEP 1: Prepare Backend (30 minutes)

### 1.1 Copy Your API Code

```bash
cd /Users/omkarthorve/Desktop/poc_RCA

# Copy your existing API to deployment folder
cp -r phase5_agentic_reasoning/api/* deployment/backend/

# Copy models
mkdir -p deployment/backend/models
cp phase3_anomaly_detection/models/*.keras deployment/backend/models/
cp phase4_kg_embeddings/embeddings/*.npy deployment/backend/models/

# Copy knowledge graph files
mkdir -p deployment/backend/knowledge_graph
cp knowledge_graph/ontology/*.owl deployment/backend/knowledge_graph/
cp knowledge_graph/mappings/*.json deployment/backend/knowledge_graph/
```

### 1.2 Create requirements.txt

```bash
cd deployment/backend
cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0
google-generativeai==0.3.1
langgraph==0.0.40
langchain==0.0.350
langchain-google-genai==0.0.6
neo4j==5.14.0
tensorflow==2.15.0
torch==2.1.0
numpy==1.24.3
pandas==2.1.3
owlready2==0.45
EOF
```

### 1.3 Initialize Git

```bash
cd /Users/omkarthorve/Desktop/poc_RCA

# Initialize if not already
git init
git add .
git commit -m "Initial commit - RCA system ready for deployment"

# Create GitHub repo and push
# Go to github.com → New Repository → "rca-system"
git remote add origin https://github.com/YOUR_USERNAME/rca-system.git
git branch -M main
git push -u origin main
```

---

## STEP 2: Deploy Backend to Render.com (20 minutes)

### 2.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `rca-backend`
   - **Root Directory:** `deployment/backend`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** Free

### 2.2 Add Environment Variables

Click **"Environment"** tab and add:

```
GOOGLE_API_KEY=your_actual_gemini_key_here
NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password
PYTHON_VERSION=3.11.0
```

### 2.3 Deploy

- Click **"Create Web Service"**
- Wait 5-10 minutes for deployment
- Your backend will be at: `https://rca-backend-xxxx.onrender.com`

### 2.4 Test Backend

```bash
# Test health endpoint
curl https://YOUR_BACKEND_URL.onrender.com/api/health

# Should return: {"status": "healthy"}
```

---

## STEP 3: Setup Neo4j Aura (15 minutes)

### 3.1 Create Database

1. Go to https://console.neo4j.io
2. Click **"New Instance"**
3. Select **"AuraDB Free"**
4. Note down:
   - URI: `neo4j+s://xxxxx.databases.neo4j.io`
   - Username: `neo4j`
   - Password: (you set this)

### 3.2 Import Knowledge Graph

```bash
# Install Neo4j Desktop or use Neo4j Browser
# Upload your .cypher files from knowledge_graph/rules/

# Or use Python script:
python << 'EOF'
from neo4j import GraphDatabase

uri = "neo4j+s://xxxxx.databases.neo4j.io"
driver = GraphDatabase.driver(uri, auth=("neo4j", "password"))

with driver.session() as session:
    # Import your KG data
    session.run("CREATE (n:Equipment {name: 'Tool Wear Sensor'})")
    # ... more imports

driver.close()
EOF
```

### 3.3 Update Backend Environment

Go back to Render dashboard → rca-backend → Environment  
Update with your actual Neo4j credentials

---

## STEP 4: Create Frontend (1.5 hours)

### 4.1 Initialize Next.js Project

```bash
cd /Users/omkarthorve/Desktop/poc_RCA/deployment/frontend

# Install dependencies
npm install

# Or if package.json doesn't work, create fresh:
npx create-next-app@latest . --typescript --tailwind --app

# Install additional packages
npm install axios lucide-react
```

### 4.2 Configure API URL

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL.onrender.com
```

### 4.3 Test Locally

```bash
npm run dev
# Open http://localhost:3000
# Test the analyze page
```

---

## STEP 5: Deploy Frontend to Render.com (15 minutes)

### 5.1 Build Configuration

Create `deployment/frontend/render.yaml`:
```yaml
services:
  - type: web
    name: rca-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: out
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://YOUR_BACKEND_URL.onrender.com
```

### 5.2 Modify next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### 5.3 Deploy

```bash
git add .
git commit -m "Add frontend"
git push origin main
```

In Render Dashboard:
1. **"New +"** → **"Static Site"**
2. Connect repository
3. **Root Directory:** `deployment/frontend`
4. **Build Command:** `npm install && npm run build`
5. **Publish Directory:** `out`
6. Add environment variable: `NEXT_PUBLIC_API_URL`
7. Click **"Create Static Site"**

Your frontend will be at: `https://rca-frontend-xxxx.onrender.com`

---

## STEP 6: Final Testing (15 minutes)

### 6.1 Test Complete Flow

1. Open your frontend URL
2. Click "Analyze Anomaly"
3. Enter: `AI4I_anomaly_0`
4. Click "Analyze"
5. Wait for results (30-90 seconds due to cold start)
6. Verify all components work

### 6.2 Pre-Demo Checklist

- [ ] Backend health endpoint responds
- [ ] Frontend loads correctly
- [ ] Can submit anomaly for analysis
- [ ] Results display properly
- [ ] All 3 pages accessible (Home, Dashboard, Analyze)

---

## TROUBLESHOOTING

### Backend Issues

**Build fails:**
```bash
# Check requirements.txt is correct
# Reduce TensorFlow to CPU version:
tensorflow-cpu==2.15.0
```

**Timeout on first request:**
- Normal for free tier (30s spin-up)
- Keep tab open during demo
- Make test request 2 mins before presenting

**500 errors:**
- Check Render logs: Dashboard → rca-backend → Logs
- Verify environment variables are set
- Test Neo4j connection

### Frontend Issues

**API calls fail:**
- Check CORS settings in backend
- Verify API URL in environment variables
- Check browser console for errors

**Build fails:**
- Delete node_modules and package-lock.json
- Run: `npm install` again
- Check all imports are correct

---

## DEMO PREPARATION (Tomorrow Morning)

### 15 Minutes Before Demo:

1. **Warm up services:**
```bash
curl https://YOUR_BACKEND_URL.onrender.com/api/health
```

2. **Open frontend in browser:**
   - Keep tab open (prevents cold start)

3. **Prepare sample anomalies:**
   - `AI4I_anomaly_0`
   - `AI4I_anomaly_100`
   - Have IDs ready to copy-paste

4. **Test internet connection:**
   - Ensure stable WiFi
   - Have mobile hotspot as backup

### During Demo:

1. Show **Home Page** - explain architecture
2. Navigate to **Analyze Page**
3. Enter anomaly ID and analyze
4. While waiting, explain the 4-agent system
5. Show results: root cause, confidence, explanation
6. Emphasize: 100% workflow success, 84.6% accuracy

---

## SUCCESS CRITERIA

✅ Backend deployed and accessible  
✅ Frontend deployed and looks good  
✅ Can analyze at least 1 anomaly successfully  
✅ All pages load without errors  
✅ Ready to demo by tomorrow morning  

## ESTIMATED COSTS

- **Render Backend:** FREE (750 hours/month)
- **Render Frontend:** FREE  
- **Neo4j Aura:** FREE (200MB limit)
- **Total:** $0.00 ✅

---

## BACKUP PLAN (If Render has issues)

### Quick Alternative: Vercel Frontend + Local Backend

1. Deploy frontend to Vercel (5 mins):
```bash
cd deployment/frontend
npx vercel
```

2. Run backend locally with ngrok (2 mins):
```bash
cd phase5_agentic_reasoning/api
uvicorn main:app --host 0.0.0.0 --port 8000

# In another terminal:
ngrok http 8000
# Use ngrok URL as NEXT_PUBLIC_API_URL
```

This gives you:
- Beautiful frontend on Vercel
- Backend running on your laptop
- No deployment complexity
- Works perfectly for demo

---

## CONTACT FOR HELP

If you face issues:
1. Check Render logs first
2. Google the error message
3. Try the backup plan (Vercel + ngrok)

**You got this! The system is ready, just needs to be packaged up! 🚀**
