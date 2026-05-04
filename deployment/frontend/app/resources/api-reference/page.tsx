import Link from 'next/link';

const METHOD_COLORS: Record<string, string> = {
  GET: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  POST: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  PATCH: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const ENDPOINTS = [
  {
    group: 'Sensor',
    items: [
      {
        method: 'POST',
        path: '/api/sensor/ingest',
        desc: 'Ingest a single sensor reading. Returns ensemble score, severity, is_anomaly flag, and workflow_id if RCA was triggered.',
        request: `{
  "machine_id": "eq-001",       // string, required
  "air_temperature": 298.1,     // number (K), required
  "process_temperature": 308.6, // number (K), required
  "rotational_speed": 1551,     // number (RPM), required
  "torque": 42.8,               // number (Nm), required
  "tool_wear": 0,               // number (min), required
  "machine_type": "M"           // "H" | "L" | "M", required
}`,
        response: `{
  "reading_id": "rdg_abc123",
  "ensemble_score": 0.73,
  "is_anomaly": true,
  "severity": "high",
  "workflow_id": "wf_def456",   // present if RCA triggered
  "timestamp": "2026-05-05T10:22:00Z"
}`,
      },
      {
        method: 'GET',
        path: '/api/sensors/history',
        desc: 'Retrieve reading history for a given equipment ID. Supports limit and hours query parameters.',
        request: `GET /api/sensors/history?machine_id=eq-001&hours=24&limit=100`,
        response: `{
  "readings": [
    {
      "reading_id": "rdg_abc123",
      "ensemble_score": 0.73,
      "is_anomaly": true,
      "severity": "high",
      "timestamp": "2026-05-05T10:22:00Z"
    }
  ],
  "total": 47
}`,
      },
    ],
  },
  {
    group: 'Equipment',
    items: [
      {
        method: 'GET',
        path: '/api/equipment',
        desc: 'List all registered equipment with current health scores, anomaly counts, and status.',
        request: `GET /api/equipment`,
        response: `{
  "equipment": [
    {
      "id": "eq-001",
      "name": "CNC Mill 01",
      "machine_type": "M",
      "health_score": 82,
      "status": "warning",
      "anomaly_count": 3,
      "last_reading": "2026-05-05T10:22:00Z"
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/api/equipment',
        desc: 'Register a new piece of equipment.',
        request: `{
  "name": "CNC Mill 01",
  "machine_type": "M",   // "H" | "L" | "M"
  "location": "Bay 3"   // optional
}`,
        response: `{
  "id": "eq-001",
  "name": "CNC Mill 01",
  "machine_type": "M",
  "health_score": 100,
  "status": "normal",
  "created_at": "2026-05-05T09:00:00Z"
}`,
      },
    ],
  },
  {
    group: 'Alerts',
    items: [
      {
        method: 'GET',
        path: '/api/alerts',
        desc: 'List active alerts. Filter by severity (critical | high | medium) and acknowledged status.',
        request: `GET /api/alerts?severity=critical&acknowledged=false`,
        response: `{
  "alerts": [
    {
      "id": "alt_xyz789",
      "machine_id": "eq-001",
      "severity": "critical",
      "ensemble_score": 0.91,
      "message": "Probable heat dissipation failure",
      "acknowledged": false,
      "timestamp": "2026-05-05T10:22:00Z"
    }
  ],
  "total": 1
}`,
      },
      {
        method: 'PATCH',
        path: '/api/alerts/{id}/acknowledge',
        desc: 'Acknowledge an alert by ID. Removes it from the active alerts count.',
        request: `PATCH /api/alerts/alt_xyz789/acknowledge`,
        response: `{
  "id": "alt_xyz789",
  "acknowledged": true,
  "acknowledged_at": "2026-05-05T10:35:00Z"
}`,
      },
    ],
  },
  {
    group: 'Dashboard',
    items: [
      {
        method: 'GET',
        path: '/api/dashboard/summary',
        desc: 'Fleet overview — total equipment, active alerts by severity, anomalies in last 24h, open maintenance tasks.',
        request: `GET /api/dashboard/summary`,
        response: `{
  "total_equipment": 12,
  "active_alerts": {
    "critical": 1,
    "high": 3,
    "medium": 7
  },
  "anomalies_24h": 14,
  "open_maintenance_tasks": 5,
  "fleet_health_avg": 78
}`,
      },
    ],
  },
  {
    group: 'Maintenance',
    items: [
      {
        method: 'GET',
        path: '/api/maintenance/tasks',
        desc: 'List all maintenance tasks with status. Filter by status (open | in_progress | done) and machine_id.',
        request: `GET /api/maintenance/tasks?status=open`,
        response: `{
  "tasks": [
    {
      "id": "tsk_001",
      "machine_id": "eq-001",
      "title": "Inspect bearing — probable wear",
      "priority": "high",
      "status": "open",
      "rca_id": "wf_def456",
      "created_at": "2026-05-05T10:23:00Z"
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/api/maintenance/history',
        desc: 'Log a completed maintenance event. Feeds the Learning Agent for continuous improvement.',
        request: `{
  "machine_id": "eq-001",
  "task_id": "tsk_001",
  "action_taken": "Replaced bearing unit B-12",
  "confirmed_root_cause": "bearing_wear",
  "technician": "J. Smith",
  "completed_at": "2026-05-05T14:00:00Z"
}`,
        response: `{
  "history_id": "hst_001",
  "status": "logged",
  "learning_agent_updated": true
}`,
      },
    ],
  },
];

export default function ApiReferencePage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/resources" className="hover:text-emerald-400 transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-slate-400">API Reference</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          REST API · v1.0
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">API Reference</h1>
        <p className="text-lg text-slate-400 max-w-xl mb-6">
          Complete endpoint documentation with request schemas, response examples, and notes.
        </p>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-lg">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Base URL</span>
          <code className="text-sm text-emerald-400 font-mono">https://rca-backend-5jlv.onrender.com</code>
        </div>
      </section>

      {/* Auth note */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <div className="flex gap-4 p-5 rounded-xl bg-slate-900 border border-yellow-700/30">
          <div className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <span className="text-yellow-400 text-xs font-bold">!</span>
          </div>
          <div>
            <div className="font-semibold text-slate-200 text-sm mb-1">Authentication</div>
            <p className="text-sm text-slate-400">
              Include your API key as a header: <code className="text-emerald-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">Authorization: Bearer YOUR_API_KEY</code>. 
              API keys are generated in Settings → API Keys after sign up.
            </p>
          </div>
        </div>
      </section>

      {/* Endpoint groups */}
      <section className="max-w-5xl mx-auto px-6 pb-20 space-y-12">
        {ENDPOINTS.map((group) => (
          <div key={group.group}>
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-5">{group.group}</h2>
            <div className="space-y-5">
              {group.items.map((ep) => (
                <div key={ep.path} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${METHOD_COLORS[ep.method]}`}>
                      {ep.method}
                    </span>
                    <code className="text-sm text-slate-200 font-mono">{ep.path}</code>
                  </div>
                  <div className="p-5 space-y-5">
                    <p className="text-sm text-slate-400">{ep.desc}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Request</div>
                        <pre className="text-xs text-slate-300 font-mono bg-slate-950 rounded-lg p-4 overflow-x-auto leading-relaxed border border-slate-800">{ep.request}</pre>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Response</div>
                        <pre className="text-xs text-slate-300 font-mono bg-slate-950 rounded-lg p-4 overflow-x-auto leading-relaxed border border-slate-800">{ep.response}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
