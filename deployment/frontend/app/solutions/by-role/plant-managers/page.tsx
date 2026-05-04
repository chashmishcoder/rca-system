import Link from 'next/link';

const STATS = [
  { v: '$250K+', l: 'Avg cost of unplanned downtime per hour (heavy industry)' },
  { v: '30%', l: 'Of maintenance spend wasted on unnecessary PMs' },
  { v: '5×', l: 'Higher cost to fix vs. prevent a failure' },
  { v: '87.3%', l: 'DiagAI anomaly detection F1 score' },
];

const HOW = [
  {
    title: 'Fleet health dashboard',
    desc: 'Every machine in your plant has a live health score (0–100). See at a glance which assets need attention and which are running normally — no digging through sensor logs.',
  },
  {
    title: 'Downtime risk scoring',
    desc: 'DiagAI assigns a risk score to each active anomaly based on severity, equipment criticality, and historical failure patterns. Prioritise your team\'s time on what matters most.',
  },
  {
    title: 'Maintenance KPI tracking',
    desc: 'Monitor MTBF, MTTR, alert-to-resolution times, and maintenance task completion rates. Export to PDF for board reporting.',
  },
  {
    title: 'Audit-ready logs',
    desc: 'Every anomaly event, RCA output, and maintenance action is logged with timestamps and technician signatures — ready for ISO, OSHA, or insurance audits.',
  },
];

export default function PlantManagersPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/solutions" className="hover:text-emerald-400 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-slate-400">Plant Managers</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          By Role
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          DiagAI for<br className="hidden md:block" /> Plant Managers
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Turn your maintenance operation from reactive to predictive. Get full fleet visibility, quantify downtime risk, and prove ROI — all from a single dashboard.
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

      {/* Cost context */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-3">The business case for predictive maintenance</h2>
          <p className="text-slate-400 text-sm mb-8">Industry benchmarks show the economic urgency of moving beyond reactive maintenance.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.l} className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{s.v}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">What DiagAI gives you</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {HOW.map((h) => (
            <div key={h.title} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-emerald-400 mb-2">{h.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROI callout */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 p-10">
          <h2 className="text-xl font-bold mb-3">Typical ROI in 90 days</h2>
          <p className="text-slate-300 text-sm mb-6 max-w-xl">
            DiagAI customers typically avoid 2–4 unplanned downtime events in the first 90 days of deployment. At industry-average downtime costs, that&apos;s $500K+ in protected production value.
          </p>
          <Link href="/signup" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 transition-all">
            Calculate your ROI →
          </Link>
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/solutions/by-role/maintenance-engineers" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Maintenance Engineers
          </Link>
          <Link href="/solutions/by-role/reliability-engineers" className="text-sm font-semibold text-emerald-400 hover:underline">
            Reliability Engineers →
          </Link>
        </div>
      </section>

    </div>
  );
}
