import Link from 'next/link';

const ENTITY_TYPES = [
  'Equipment', 'Sensor', 'Failure Mode', 'Symptom', 'Root Cause',
  'Maintenance Action', 'Component', 'Environment', 'Operator', 'Process',
];

const CAPABILITIES = [
  {
    title: 'Semantic Reasoning',
    desc: 'SWRL rules encode expert knowledge like "if torque > 2σ AND temp_diff > 1.5σ THEN probable bearing failure" — logic no ML model alone can express.',
  },
  {
    title: 'Causal Chain Mapping',
    desc: 'The graph stores directed causal edges between entities. When an anomaly occurs, agents traverse causal chains to find the most likely origin.',
  },
  {
    title: 'Cross-Domain Patterns',
    desc: 'Failure patterns learned from one machine type are transferable to similar equipment via OWL class hierarchies and property inheritance.',
  },
  {
    title: 'Contextual Alerts',
    desc: "Instead of 'anomaly detected', DiagAI returns 'probable bearing wear caused by thermal overload — see recommended maintenance action #3'.",
  },
];

export default function KnowledgeGraphPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/product" className="hover:text-emerald-400 transition-colors">Product</Link>
          <span>/</span>
          <span className="text-slate-400">Knowledge Graph</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Feature
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          Knowledge Graph
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          A semantic OWL ontology encodes decades of industrial maintenance expertise into machine-readable rules — giving DiagAI agents the contextual understanding no pure ML model can match.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
          {[
            { v: '50+', l: 'Entity types' },
            { v: 'OWL', l: 'Ontology format' },
            { v: 'SWRL', l: 'Rule language' },
          ].map((s) => (
            <div key={s.l} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{s.v}</div>
              <div className="text-xs text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
        <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
          Start Free Trial →
        </Link>
      </section>

      {/* Capabilities */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-emerald-400 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entity types */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">Entity types in the ontology</h2>
        <div className="flex flex-wrap gap-2">
          {ENTITY_TYPES.map((e) => (
            <span key={e} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-300">
              {e}
            </span>
          ))}
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
            +40 more
          </span>
        </div>
      </section>

      {/* Sample rule */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Sample SWRL rule</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 font-mono text-sm overflow-x-auto">
          <div className="text-slate-500 mb-2">// Bearing overload detection rule</div>
          <div>
            <span className="text-teal-400">Equipment</span>
            <span className="text-slate-400">(?e) </span>
            <span className="text-emerald-400">∧</span>
            <span className="text-slate-400"> </span>
            <span className="text-teal-400">hasTorqueZScore</span>
            <span className="text-slate-400">(?e, ?t) </span>
            <span className="text-emerald-400">∧</span>
            <span className="text-slate-400"> </span>
            <span className="text-teal-400">greaterThan</span>
            <span className="text-slate-400">(?t, 2.0)</span>
          </div>
          <div>
            <span className="text-teal-400">hasTempDiffZScore</span>
            <span className="text-slate-400">(?e, ?d) </span>
            <span className="text-emerald-400">∧</span>
            <span className="text-slate-400"> </span>
            <span className="text-teal-400">greaterThan</span>
            <span className="text-slate-400">(?d, 1.5)</span>
          </div>
          <div className="mt-2">
            <span className="text-emerald-400">→ </span>
            <span className="text-teal-400">probableCause</span>
            <span className="text-slate-400">(?e, </span>
            <span className="text-yellow-400">BearingWear</span>
            <span className="text-slate-400">)</span>
          </div>
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/product/features/multi-agent-rca" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Multi-Agent RCA
          </Link>
          <Link href="/product/features/predictive-analytics" className="text-sm font-semibold text-emerald-400 hover:underline">
            Predictive Analytics →
          </Link>
        </div>
      </section>

    </div>
  );
}
