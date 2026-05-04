import Link from 'next/link';

const AGENTS = [
  {
    name: 'Diagnostic Agent',
    role: 'Symptom analysis',
    desc: 'Receives the raw anomaly signal and ensemble score. Classifies the symptom cluster and queries the knowledge graph for matching failure patterns.',
    color: 'emerald',
  },
  {
    name: 'Reasoning Agent',
    role: 'Root cause inference',
    desc: 'Uses Groq Llama 3.3 70B to reason over the symptom cluster, equipment history, and SWRL rules. Returns ranked probable root causes with confidence scores.',
    color: 'teal',
  },
  {
    name: 'Planning Agent',
    role: 'Maintenance recommendations',
    desc: 'Translates confirmed root causes into prioritised maintenance tasks — from immediate corrective actions to scheduled preventive measures.',
    color: 'cyan',
  },
  {
    name: 'Learning Agent',
    role: 'Continuous improvement',
    desc: 'Records technician feedback and outcome data to refine future diagnoses. Accuracy improves with every confirmed or corrected RCA.',
    color: 'emerald',
  },
];

const METRICS = [
  { label: 'RCA Success Rate', value: '84.6%' },
  { label: 'Avg workflow time', value: '77s' },
  { label: 'Confidence score', value: '0.862' },
  { label: 'Agents in pipeline', value: '4' },
];

export default function MultiAgentRcaPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/product" className="hover:text-emerald-400 transition-colors">Product</Link>
          <span>/</span>
          <span className="text-slate-400">Multi-Agent RCA</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Feature
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          Multi-Agent RCA
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          When an anomaly is detected, a LangGraph-orchestrated pipeline of 4 specialised AI agents automatically investigates the fault, traces its root cause, and produces an actionable maintenance plan.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {METRICS.map((m) => (
            <div key={m.label} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{m.value}</div>
              <div className="text-xs text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>
        <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
          Start Free Trial →
        </Link>
      </section>

      {/* Agents */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-3">The 4-agent pipeline</h2>
          <p className="text-slate-400 text-sm mb-10">Agents execute in sequence. Each feeds its output into the next, building context progressively.</p>

          <div className="relative space-y-4">
            {/* Connector */}
            <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-emerald-500/30 via-teal-500/30 to-transparent hidden md:block" />

            {AGENTS.map((a, i) => (
              <div key={a.name} className="relative flex gap-5 p-6 rounded-xl bg-slate-900 border border-slate-800 md:ml-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10">
                  <span className="text-xs font-bold text-emerald-400">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-100">{a.name}</h3>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{a.role}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8">Technology</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: 'LangGraph', desc: 'Directed agent orchestration with state management and conditional branching.' },
            { name: 'Groq Llama 3.3 70B', desc: 'Ultra-fast inference for the reasoning agent — sub-second LLM responses even on complex fault trees.' },
            { name: 'Knowledge Graph', desc: 'OWL ontology with 50+ entities provides the structured context agents reason over.' },
          ].map((t) => (
            <div key={t.name} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-emerald-400 mb-2">{t.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/product/features/anomaly-detection" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Anomaly Detection
          </Link>
          <Link href="/product/features/knowledge-graph" className="text-sm font-semibold text-emerald-400 hover:underline">
            Knowledge Graph →
          </Link>
        </div>
      </section>

    </div>
  );
}
