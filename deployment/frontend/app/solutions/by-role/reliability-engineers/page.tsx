import Link from 'next/link';

const CAPABILITIES = [
  {
    title: 'Ensemble model transparency',
    desc: 'Inspect the 0.6×LSTM + 0.4×RF weighting, per-feature z-scores, and reconstruction error for every anomaly event. Full model explainability — no black boxes.',
  },
  {
    title: 'Knowledge graph authoring',
    desc: 'Add new SWRL rules and OWL entity types through a structured interface. Your domain expertise becomes machine-executable logic instantly.',
  },
  {
    title: 'Cross-domain pattern library',
    desc: 'Failure patterns observed on one machine type propagate via OWL class hierarchies to similar equipment — reducing the cold-start problem on new asset deployments.',
  },
  {
    title: 'Confidence-scored RCA chains',
    desc: 'Every root cause comes with a confidence score (0–1) and a traceable causal chain — from symptom through intermediate causes to root origin.',
  },
  {
    title: 'A/B model evaluation',
    desc: 'Run historical sensor data against different model configurations to compare detection rates before deploying a configuration change to production.',
  },
  {
    title: 'Learning agent feedback',
    desc: "Log confirmed diagnoses and corrections. The Learning Agent reweights future RCA outputs based on your fleet's specific failure history.",
  },
];

export default function ReliabilityEngineersPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/solutions" className="hover:text-emerald-400 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-slate-400">Reliability Engineers</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          By Role
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          DiagAI for<br className="hidden md:block" /> Reliability Engineers
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          A platform built for engineers who need more than a dashboard. Access the full model stack, author new knowledge graph rules, and drive continuous improvement across your entire asset fleet.
        </p>
        <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
          Start Free Trial →
        </Link>
      </section>

      {/* Key metrics strip */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: '13', l: 'Engineered input features' },
              { v: '50+', l: 'Knowledge graph entity types' },
              { v: '0.862', l: 'Avg RCA confidence score' },
              { v: 'SWRL', l: 'Rule language' },
            ].map((m) => (
              <div key={m.l} className="text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{m.v}</div>
                <div className="text-xs text-slate-500">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">Deep-control capabilities</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-emerald-400 mb-2">{c.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related links */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Go deeper</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { href: '/product/features/anomaly-detection', label: 'Anomaly Detection →', desc: 'LSTM autoencoder architecture and ensemble scoring' },
            { href: '/product/features/knowledge-graph', label: 'Knowledge Graph →', desc: 'OWL ontology, SWRL rules, and causal chain mapping' },
            { href: '/product/api', label: 'API Reference →', desc: 'Integrate DiagAI into your own tooling' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="group p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-700/50 transition-all">
              <div className="font-semibold text-sm text-emerald-400 group-hover:underline mb-1">{l.label}</div>
              <div className="text-xs text-slate-500">{l.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/solutions/by-role/plant-managers" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Plant Managers
          </Link>
          <Link href="/solutions/by-industry/manufacturing" className="text-sm font-semibold text-emerald-400 hover:underline">
            Manufacturing →
          </Link>
        </div>
      </section>

    </div>
  );
}
