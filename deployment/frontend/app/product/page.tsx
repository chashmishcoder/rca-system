import Link from 'next/link';

const FEATURES = [
  {
    href: '/product/features/anomaly-detection',
    icon: '🔍',
    title: 'Anomaly Detection',
    stat: '87.3% F1',
    statColor: 'text-emerald-400',
    desc: 'LSTM autoencoder trained on 10,000+ industrial readings. Detects deviations in air temperature, torque, RPM, tool wear and 9 other signals in under 2 seconds.',
    bullets: ['Real-time z-score inference', 'LSTM + Random Forest ensemble', 'Configurable thresholds', 'Multi-sensor fusion'],
  },
  {
    href: '/product/features/multi-agent-rca',
    icon: '🤖',
    title: 'Multi-Agent RCA',
    stat: '84.6% accuracy',
    statColor: 'text-teal-400',
    desc: '4 specialized LangGraph agents collaborate to diagnose every fault — from initial symptom detection through root cause identification to remediation planning.',
    bullets: ['Diagnostic, Reasoning, Planning & Learning agents', 'Groq Llama 3.3 70B reasoning', 'Parallel agent execution', 'Confidence-scored outputs'],
  },
  {
    href: '/product/features/knowledge-graph',
    icon: '🕸️',
    title: 'Knowledge Graph',
    stat: '50+ entities',
    statColor: 'text-cyan-400',
    desc: 'A semantic OWL ontology maps equipment components, failure modes, environmental factors and causal relationships — enabling contextual reasoning no threshold can match.',
    bullets: ['OWL/SWRL ontology', '50+ equipment entity types', 'Causal relationship mapping', 'Cross-domain failure patterns'],
  },
  {
    href: '/product/features/predictive-analytics',
    icon: '📈',
    title: 'Predictive Analytics',
    stat: 'Ensemble model',
    statColor: 'text-emerald-400',
    desc: 'Equipment health scores update in real time as anomalies accumulate. Trend forecasting flags degradation trajectories before they reach failure thresholds.',
    bullets: ['0.6×LSTM + 0.4×RF ensemble', 'Health score decay model', 'Severity classification (4 levels)', 'Fleet-wide dashboards'],
  },
];

const PILLARS = [
  { label: 'Ingest', desc: 'REST API, batch CSV, or live stream' },
  { label: 'Detect', desc: 'LSTM + RF ensemble in <2s' },
  { label: 'Diagnose', desc: '4-agent LangGraph workflow' },
  { label: 'Act', desc: 'Ranked recommendations + CMMS push' },
];

export default function ProductPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
            Platform Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            The DiagAI Platform
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Four integrated capabilities — anomaly detection, multi-agent RCA, knowledge graph reasoning, and predictive analytics — working together as one system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
              Start Free Trial →
            </Link>
            <Link href="/product/api" className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700">
              View API Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Pipeline strip */}
      <section className="border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PILLARS.map((p, i) => (
              <div key={p.label} className="flex items-center gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-400">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">{p.label}</div>
                  <div className="text-xs text-slate-500">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="group p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{f.icon}</span>
                <h2 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">{f.title}</h2>
                <span className={`ml-auto text-xs font-semibold ${f.statColor} bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700`}>{f.stat}</span>
              </div>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">{f.desc}</p>
              <ul className="space-y-1.5">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-5 text-sm font-medium text-emerald-400 group-hover:underline">
                Learn more →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* API CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <Link href="/product/api" className="group block p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/50 transition-all">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-xs font-mono border border-slate-700">REST API</span>
                <span className="text-xs text-slate-500">v1.0</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-2">Integrate DiagAI into your stack</h2>
              <p className="text-sm text-slate-400">Push sensor readings, trigger RCA workflows, and retrieve recommendations via a clean REST API. Full OpenAPI spec included.</p>
            </div>
            <div className="shrink-0 bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-400 leading-relaxed min-w-[220px]">
              <span className="text-emerald-400">POST</span> /api/sensor/ingest<br />
              <span className="text-emerald-400">GET </span> /api/alerts<br />
              <span className="text-emerald-400">GET </span> /api/dashboard/summary
            </div>
          </div>
        </Link>
      </section>

    </div>
  );
}
