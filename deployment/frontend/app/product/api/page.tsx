import Link from 'next/link';

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/sensor/ingest',
    desc: 'Submit a sensor reading. Returns ensemble anomaly score, severity, and workflow_id if RCA is triggered.',
    badge: 'Core',
  },
  {
    method: 'GET',
    path: '/api/dashboard/summary',
    desc: 'Fleet overview — total equipment, active alerts, anomalies in last 24h, open maintenance tasks.',
    badge: 'Dashboard',
  },
  {
    method: 'GET',
    path: '/api/equipment',
    desc: 'List all registered equipment with current health scores and status.',
    badge: 'Equipment',
  },
  {
    method: 'GET',
    path: '/api/equipment/{id}',
    desc: 'Get full detail for a single piece of equipment.',
    badge: 'Equipment',
  },
  {
    method: 'POST',
    path: '/api/equipment',
    desc: 'Register a new piece of equipment in the fleet.',
    badge: 'Equipment',
  },
  {
    method: 'GET',
    path: '/api/alerts',
    desc: 'List all active alerts, filterable by severity and acknowledged status.',
    badge: 'Alerts',
  },
  {
    method: 'PATCH',
    path: '/api/alerts/{id}/acknowledge',
    desc: 'Acknowledge an alert. Removes it from the active alerts count.',
    badge: 'Alerts',
  },
  {
    method: 'GET',
    path: '/api/sensors/history',
    desc: 'Retrieve sensor reading history for an equipment ID over a configurable time window.',
    badge: 'Sensors',
  },
  {
    method: 'GET',
    path: '/api/maintenance/tasks',
    desc: 'List all maintenance tasks with status (open / in_progress / done).',
    badge: 'Maintenance',
  },
  {
    method: 'POST',
    path: '/api/maintenance/history',
    desc: 'Log a completed maintenance event to the permanent history.',
    badge: 'Maintenance',
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  POST: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  PATCH: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const BADGE_COLORS: Record<string, string> = {
  Core: 'bg-emerald-500/10 text-emerald-400',
  Dashboard: 'bg-teal-500/10 text-teal-400',
  Equipment: 'bg-cyan-500/10 text-cyan-400',
  Alerts: 'bg-orange-500/10 text-orange-400',
  Sensors: 'bg-blue-500/10 text-blue-400',
  Maintenance: 'bg-purple-500/10 text-purple-400',
};

export default function ApiPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/product" className="hover:text-emerald-400 transition-colors">Product</Link>
          <span>/</span>
          <span className="text-slate-400">API</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          REST API · v1.0
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          DiagAI API
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Integrate DiagAI directly into your MES, SCADA, or CMMS. Push sensor readings, retrieve anomaly alerts, and manage maintenance tasks programmatically.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
            Get API Key →
          </Link>
          <Link href="/resources/api-reference" className="inline-flex items-center px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700">
            Full Reference Docs
          </Link>
        </div>
      </section>

      {/* Quick start */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold mb-6">Quick start — ingest a reading</h2>
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 font-mono text-sm overflow-x-auto leading-relaxed">
            <div className="text-slate-500 mb-3">{'# Push a sensor reading'}</div>
            <div>
              <span className="text-emerald-400">curl</span>
              <span className="text-slate-300"> -X POST https://rca-backend-5jlv.onrender.com/api/sensor/ingest \</span>
            </div>
            <div className="ml-4">
              <span className="text-teal-400">-H</span>
              <span className="text-yellow-300"> &quot;Content-Type: application/json&quot;</span>
              <span className="text-slate-300"> \</span>
            </div>
            <div className="ml-4">
              <span className="text-teal-400">-d</span>
              <span className="text-yellow-300"> &apos;&#123;</span>
            </div>
            <div className="ml-8 text-yellow-300">
              &quot;machine_id&quot;: &quot;eq-001&quot;,<br />
              &quot;air_temperature&quot;: 298.1,<br />
              &quot;process_temperature&quot;: 308.6,<br />
              &quot;rotational_speed&quot;: 1551,<br />
              &quot;torque&quot;: 42.8,<br />
              &quot;tool_wear&quot;: 0,<br />
              &quot;machine_type&quot;: &quot;M&quot;
            </div>
            <div className="ml-4 text-yellow-300">&apos;&#125;&apos;</div>
            <div className="mt-5 text-slate-500">{'# Response'}</div>
            <div className="mt-1 text-slate-300">{'{'}</div>
            <div className="ml-4">
              <span className="text-teal-400">&quot;ensemble_score&quot;</span>
              <span className="text-slate-400">: </span>
              <span className="text-emerald-400">0.49</span>
              <span className="text-slate-400">,</span>
            </div>
            <div className="ml-4">
              <span className="text-teal-400">&quot;is_anomaly&quot;</span>
              <span className="text-slate-400">: </span>
              <span className="text-orange-400">false</span>
              <span className="text-slate-400">,</span>
            </div>
            <div className="ml-4">
              <span className="text-teal-400">&quot;severity&quot;</span>
              <span className="text-slate-400">: </span>
              <span className="text-yellow-300">&quot;normal&quot;</span>
            </div>
            <div className="text-slate-300">{'}'}</div>
          </div>
        </div>
      </section>

      {/* Endpoint table */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-800">
            {ENDPOINTS.map((ep) => (
              <div key={ep.path} className="flex flex-col md:flex-row md:items-center gap-3 px-5 py-4 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${METHOD_COLORS[ep.method] || 'text-slate-400'}`}>
                    {ep.method}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${BADGE_COLORS[ep.badge]}`}>
                    {ep.badge}
                  </span>
                </div>
                <code className="text-sm text-emerald-300 font-mono md:w-64 shrink-0">{ep.path}</code>
                <p className="text-sm text-slate-400">{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Base URL */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Base URL</span>
          <code className="text-sm text-emerald-400 font-mono">https://rca-backend-5jlv.onrender.com</code>
          <Link href="/resources/api-reference" className="md:ml-auto text-sm font-semibold text-emerald-400 hover:underline shrink-0">
            Full API Reference →
          </Link>
        </div>
      </section>

    </div>
  );
}
