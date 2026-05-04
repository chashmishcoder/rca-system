import Link from 'next/link';

const PAIN_POINTS = [
  { label: 'Reactive-only maintenance', desc: 'Faults are found after failure — not before. Every breakdown is a surprise.' },
  { label: 'Alert fatigue', desc: 'Threshold-based systems generate hundreds of false positives per week.' },
  { label: 'No clear cause', desc: 'Current tools tell you something is wrong, but not what caused it or how to fix it.' },
  { label: 'Manual data review', desc: 'Engineers spend hours in spreadsheets instead of on the shop floor.' },
];

const HOW = [
  { step: '01', title: 'Early anomaly alerts', desc: 'LSTM + Random Forest ensemble detects deviations up to hours before mechanical failure — giving you time to schedule the repair on your terms.' },
  { step: '02', title: 'Root cause report', desc: 'Every alert comes with an AI-generated RCA report: probable cause, confidence score, causal chain, and a ranked list of recommended maintenance actions.' },
  { step: '03', title: 'Maintenance task queue', desc: 'Confirmed RCA outcomes are pushed directly into a prioritised task list — no manual ticket creation required.' },
  { step: '04', title: 'Feedback loop', desc: 'Log your findings when the job is done. The Learning Agent updates its models, improving future diagnoses for your specific equipment fleet.' },
];

export default function MaintenanceEngineersPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/solutions" className="hover:text-emerald-400 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-slate-400">Maintenance Engineers</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          By Role
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          DiagAI for<br className="hidden md:block" /> Maintenance Engineers
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Spend less time hunting for faults and more time fixing them. DiagAI gives you precise early warnings and an AI-generated repair plan before the machine fails.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
            Start Free Trial →
          </Link>
          <Link href="/dashboard" className="inline-flex items-center px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700">
            See the dashboard
          </Link>
        </div>
      </section>

      {/* Pain points */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">The challenges you face today</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {PAIN_POINTS.map((p) => (
              <div key={p.label} className="flex gap-4 p-5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="shrink-0 w-5 h-5 mt-0.5 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-400 text-xs">✕</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-200 text-sm mb-1">{p.label}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How DiagAI helps */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">How DiagAI changes your workflow</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {HOW.map((h) => (
            <div key={h.step} className="flex gap-4 p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-400">{h.step}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">{h.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key metrics */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">What you can expect</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { v: '87.3%', l: 'Anomaly F1 score' },
              { v: '<2s', l: 'Alert latency' },
              { v: '84.6%', l: 'RCA success rate' },
              { v: '77s', l: 'Avg diagnosis time' },
            ].map((m) => (
              <div key={m.l} className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{m.v}</div>
                <div className="text-xs text-slate-500">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/solutions" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← All Solutions
          </Link>
          <Link href="/solutions/by-role/plant-managers" className="text-sm font-semibold text-emerald-400 hover:underline">
            Plant Managers →
          </Link>
        </div>
      </section>

    </div>
  );
}
