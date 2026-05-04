import Link from 'next/link';

const ASSET_TYPES = ['Steam Turbines', 'Gas Turbines', 'Hydro Generators', 'Power Transformers', 'Distribution Switchgear', 'Cooling Towers'];

const USE_CASES = [
  {
    title: 'Generation asset health',
    desc: 'Monitor turbine bearing temperatures, vibration, and shaft speed in real time. DiagAI flags early thermal and mechanical deviations before they cause forced outages.',
  },
  {
    title: 'Transformer diagnostics',
    desc: 'Track winding temperature, cooling performance, and load ratios. Knowledge graph rules encode transformer-specific degradation patterns for contextual RCA.',
  },
  {
    title: 'Planned outage optimisation',
    desc: 'Health scores and trend data give outage planners accurate insight into which assets genuinely need inspection — reducing unnecessary shutdowns and overtime.',
  },
  {
    title: 'Grid reliability reporting',
    desc: 'Export anomaly histories and maintenance logs in formats compatible with NERC reliability standards and internal grid operations reporting.',
  },
];

export default function UtilitiesPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/solutions" className="hover:text-emerald-400 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-slate-400">Utilities</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          By Industry · Utilities
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          Grid reliability starts with<br className="hidden md:block" /> healthy assets
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Unplanned generation asset failures cost utilities tens of millions per event and erode customer trust. DiagAI continuously monitors your turbines, generators, and transformers — giving your operations team hours of warning, not seconds.
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {ASSET_TYPES.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-400">{tag}</span>
          ))}
        </div>
        <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
          Start Free Trial →
        </Link>
      </section>

      {/* Key stats */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: '<2s', l: 'Alert latency' },
              { v: '87.3%', l: 'Detection F1 score' },
              { v: '84.6%', l: 'RCA success rate' },
              { v: '50+', l: 'KG entity types' },
            ].map((m) => (
              <div key={m.l} className="text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{m.v}</div>
                <div className="text-xs text-slate-500">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">Use cases in utilities</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {USE_CASES.map((u) => (
            <div key={u.title} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-emerald-400 mb-2">{u.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integration callout */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Integrate with your control room</h2>
            <p className="text-slate-300 text-sm max-w-lg">
              DiagAI&apos;s REST API connects to OSIsoft PI, GE APM, ABB Ability, and any SCADA system that can make an HTTP request — with no custom middleware required.
            </p>
          </div>
          <Link href="/product/api" className="shrink-0 inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 transition-all">
            View API docs →
          </Link>
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/solutions/by-industry/oil-gas" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Oil & Gas
          </Link>
          <Link href="/solutions" className="text-sm font-semibold text-emerald-400 hover:underline">
            All Solutions →
          </Link>
        </div>
      </section>

    </div>
  );
}
