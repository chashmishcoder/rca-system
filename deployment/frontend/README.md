# RCA Dashboard - Modern React Frontend

Beautiful, production-ready dashboard for Root Cause Analysis System.

## Features

✨ **Modern UI/UX**
- Tailwind CSS for styling
- Shadcn UI components
- Responsive design
- Dark/Light mode toggle

🎨 **Customizable**
- Easy to modify colors, fonts, layouts
- Component-based architecture
- Reusable UI components

📊 **Dashboards**
- Anomaly list with search/filter
- Real-time RCA results
- Agent confidence visualization
- System health monitoring

## Quick Start (10 minutes)

### 1. Create Next.js App

```bash
cd deployment/frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

When prompted:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ App Router
- ❌ No src/ directory
- ✅ Import alias (@/*)

### 2. Install Dependencies

```bash
npm install axios lucide-react recharts
npm install -D @types/node
```

### 3. Install Shadcn UI

```bash
npx shadcn-ui@latest init
```

Choose:
- Style: Default
- Base color: Slate
- CSS variables: Yes

```bash
npx shadcn-ui@latest add button card input table badge
```

### 4. Configure API URL

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://rca-backend.onrender.com
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Render.com (FREE)

### Option 1: Via Render Dashboard

1. Go to https://dashboard.render.com
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `out`
   - Add environment variable: `NEXT_PUBLIC_API_URL=https://rca-backend.onrender.com`
5. Click "Create Static Site"

### Option 2: Via render.yaml

Already configured! Just push to GitHub:
```bash
git add .
git commit -m "Add frontend"
git push origin main
```

Render will auto-deploy both frontend and backend.

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Home page
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard
│   ├── analyze/
│   │   └── page.tsx          # RCA analysis page
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # Shadcn components
│   ├── AnomalyCard.tsx       # Custom components
│   ├── RCAResults.tsx
│   └── AgentConfidence.tsx
├── lib/
│   ├── api.ts                # API client
│   └── utils.ts              # Helper functions
├── public/
└── package.json
```

## Customization Guide

### Change Colors

Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',  // Your brand color
      secondary: '#10B981',
    }
  }
}
```

### Modify Components

All components in `components/` folder are fully customizable.

### Add New Pages

Create new file in `app/` directory:
```tsx
// app/monitoring/page.tsx
export default function MonitoringPage() {
  return <div>System Monitoring</div>
}
```

## Sample Components Created

I'll create these files next:
- Dashboard home page
- Anomaly analysis form
- RCA results display
- Agent confidence chart
- System health status
