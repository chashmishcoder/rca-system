import Link from 'next/link';

const SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    articles: [
      { title: 'Quick Start: ingest your first sensor reading', time: '5 min', href: '#quick-start' },
      { title: 'Setting up your equipment fleet', time: '8 min', href: '#fleet-setup' },
      { title: 'Understanding anomaly scores', time: '6 min', href: '#anomaly-scores' },
      { title: 'Your first RCA report', time: '10 min', href: '#first-rca' },
    ],
  },
  {
    id: 'sensor-ingest',
    title: 'Sensor Ingest',
    articles: [
      { title: 'Supported sensor types and units', time: '4 min', href: '#sensors' },
      { title: 'REST API ingest (real-time)', time: '6 min', href: '#api-ingest' },
      { title: 'Batch CSV import', time: '5 min', href: '#csv-import' },
      { title: 'Data quality validation rules', time: '4 min', href: '#validation' },
    ],
  },
  {
    id: 'anomaly-detection',
    title: 'Anomaly Detection',
    articles: [
      { title: 'How the LSTM autoencoder works', time: '12 min', href: '#lstm' },
      { title: 'The LSTM + Random Forest ensemble', time: '8 min', href: '#ensemble' },
      { title: 'Feature engineering reference (13 features)', time: '10 min', href: '#features' },
      { title: 'Configuring detection thresholds', time: '6 min', href: '#thresholds' },
    ],
  },
  {
    id: 'rca',
    title: 'Root Cause Analysis',
    articles: [
      { title: 'Multi-agent RCA workflow overview', time: '10 min', href: '#rca-overview' },
      { title: 'The 4 agents: roles and outputs', time: '8 min', href: '#agents' },
      { title: 'Reading an RCA report', time: '5 min', href: '#rca-report' },
      { title: 'Providing technician feedback', time: '4 min', href: '#feedback' },
    ],
  },
  {
    id: 'knowledge-graph',
    title: 'Knowledge Graph',
    articles: [
      { title: 'Ontology structure and entity types', time: '12 min', href: '#ontology' },
      { title: 'Writing SWRL rules', time: '15 min', href: '#swrl' },
      { title: 'Adding custom failure modes', time: '8 min', href: '#custom-modes' },
      { title: 'Cross-domain pattern reuse', time: '6 min', href: '#cross-domain' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    articles: [
      { title: 'Webhook setup and event types', time: '6 min', href: '#webhooks' },
      { title: 'Slack alert integration', time: '5 min', href: '#slack' },
      { title: 'CMMS push integration', time: '8 min', href: '#cmms' },
      { title: 'SCADA / DCS connection guide', time: '10 min', href: '#scada' },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/resources" className="hover:text-emerald-400 transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-slate-400">Documentation</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Documentation
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">DiagAI Docs</h1>
        <p className="text-lg text-slate-400 max-w-xl mb-8">
          Everything you need to deploy, configure, and extend DiagAI — from first reading to full fleet.
        </p>

        {/* Search bar (static) */}
        <div className="flex items-center gap-3 max-w-lg px-4 py-3 rounded-xl bg-slate-900 border border-slate-700">
          <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <span className="text-sm text-slate-500">Search docs…</span>
          <span className="ml-auto text-xs text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">⌘K</span>
        </div>
      </section>

      {/* Quick start callout */}
      <section className="max-w-5xl mx-auto px-6 pb-10" id="quick-start">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-teal-900/20 border border-emerald-700/30">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-400">01</span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-slate-100 mb-2">Quick Start — 5 minutes to your first anomaly detection</h2>
              <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                <li>Sign up at <Link href="/signup" className="text-emerald-400 hover:underline">/signup</Link> and copy your API key from Settings → API Keys.</li>
                <li>Register your first equipment with <code className="text-emerald-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">POST /api/equipment</code></li>
                <li>Push a sensor reading with <code className="text-emerald-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">POST /api/sensor/ingest</code> — see schema below.</li>
                <li>View the result in the <Link href="/dashboard" className="text-emerald-400 hover:underline">Dashboard</Link> or read the JSON response directly.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal ingest schema */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <h2 className="text-lg font-bold mb-4">Minimal ingest payload</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 font-mono text-sm overflow-x-auto leading-relaxed">
          <div><span className="text-slate-500">{'{'}</span></div>
          {[
            ['machine_id', '"eq-001"', 'string — your equipment ID'],
            ['air_temperature', '298.1', 'number — Kelvin'],
            ['process_temperature', '308.6', 'number — Kelvin'],
            ['rotational_speed', '1551', 'number — RPM'],
            ['torque', '42.8', 'number — Nm'],
            ['tool_wear', '0', 'number — minutes'],
            ['machine_type', '"M"', 'string — H | L | M'],
          ].map(([key, val, comment]) => (
            <div key={key} className="ml-4">
              <span className="text-teal-400">&quot;{key}&quot;</span>
              <span className="text-slate-400">: </span>
              <span className="text-yellow-300">{val}</span>
              <span className="text-slate-500">,  </span>
              <span className="text-slate-600">// {comment}</span>
            </div>
          ))}
          <div><span className="text-slate-500">{'}'}</span></div>
        </div>
      </section>

      {/* Article index */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-2 gap-8">
            {SECTIONS.map((sec) => (
              <div key={sec.id}>
                <h2 className="font-bold text-emerald-400 text-sm uppercase tracking-widest mb-4">{sec.title}</h2>
                <ul className="space-y-2">
                  {sec.articles.map((a) => (
                    <li key={a.title}>
                      <Link href={a.href} className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/60 transition-colors">
                        <span className="text-sm text-slate-300 group-hover:text-emerald-400 transition-colors">{a.title}</span>
                        <span className="text-xs text-slate-600 shrink-0 ml-3">{a.time} read</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API link */}
      <section className="max-w-5xl mx-auto px-6 py-14 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-sm text-slate-400">Looking for full endpoint schemas?</span>
          <Link href="/resources/api-reference" className="text-sm font-semibold text-emerald-400 hover:underline">
            API Reference →
          </Link>
        </div>
      </section>

    </div>
  );
}
