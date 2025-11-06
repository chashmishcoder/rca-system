#!/bin/bash

# RCA System - Quick Deployment Setup Script
# Run this to prepare everything for deployment

set -e  # Exit on error

echo "🚀 RCA System Deployment Setup"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check current directory
if [[ ! -f "PROJECT_SUMMARY_PHASES_1_TO_6.md" ]]; then
    echo "❌ Error: Please run this script from the poc_RCA directory"
    exit 1
fi

echo -e "${BLUE}Step 1: Preparing backend...${NC}"
echo ""

# Create backend directory if not exists
mkdir -p deployment/backend/models
mkdir -p deployment/backend/knowledge_graph
mkdir -p deployment/backend/data

# Copy API files
if [ -d "phase5_agentic_reasoning/api" ]; then
    echo "📦 Copying API files..."
    cp -r phase5_agentic_reasoning/api/* deployment/backend/ 2>/dev/null || true
    echo -e "${GREEN}✓ API files copied${NC}"
else
    echo -e "${YELLOW}⚠️  API directory not found${NC}"
fi

# Copy models
if [ -d "phase3_anomaly_detection/models" ]; then
    echo "🤖 Copying model files..."
    cp phase3_anomaly_detection/models/*.keras deployment/backend/models/ 2>/dev/null || true
    echo -e "${GREEN}✓ Model files copied${NC}"
fi

# Copy knowledge graph
if [ -d "knowledge_graph" ]; then
    echo "🕸️  Copying knowledge graph..."
    cp -r knowledge_graph/* deployment/backend/knowledge_graph/ 2>/dev/null || true
    echo -e "${GREEN}✓ Knowledge graph copied${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Setting up frontend...${NC}"
echo ""

cd deployment/frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing Node.js dependencies..."
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating environment file..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
    echo -e "${GREEN}✓ Environment file created${NC}"
    echo -e "${YELLOW}  → Update NEXT_PUBLIC_API_URL after backend deployment${NC}"
fi

cd ../..

echo ""
echo -e "${BLUE}Step 3: Git repository setup...${NC}"
echo ""

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - RCA system ready for deployment"
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${GREEN}✓ Git repository already exists${NC}"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create GitHub repository:"
echo "   → Go to github.com/new"
echo "   → Name: rca-system"
echo "   → Run: git remote add origin <your-repo-url>"
echo "   → Run: git push -u origin main"
echo ""
echo "2. Deploy backend to Render.com:"
echo "   → Follow deployment/DEPLOYMENT_GUIDE.md"
echo "   → Or visit: dashboard.render.com"
echo ""
echo "3. Deploy frontend to Render.com:"
echo "   → Connect same GitHub repository"
echo "   → Set root directory: deployment/frontend"
echo ""
echo "4. Test your deployment:"
echo "   → Backend: https://YOUR-APP.onrender.com/api/health"
echo "   → Frontend: https://YOUR-APP.onrender.com"
echo ""
echo "📚 Full guide: deployment/DEPLOYMENT_GUIDE.md"
echo ""
echo "Good luck with your demo tomorrow! 🎉"
