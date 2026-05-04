import Link from 'next/link';

const BY_ROLE = [
  {
    href: '/solutions/by-role/maintenance-engineers',
    title: 'Maintenance Engineers',
    desc: 'Stop chasing breakdowns. Get ahead of failures with precise anomaly alerts and AI-generated repair instructions.',
    bullets: ['Ranked maintenance task queue', 'Step-by-step RCA reports', 'Tool wear & thermal alerts'],
  },
  {
    href: '/solutions/by-role/plant-managers',
    title: 'Plant Managers',
    desc: 'Fleet-wide visibility in a single dashboard. Quantify downtime risk and make data-driven maintenance investment decisions.',
    bullets: ['Fleet health score overview', 'Cost-of-downtime estimates', 'Audit-ready maintenance logs'],
  },
  {
    href: '/solutions/by-role/reliability-engineers',
    title: 'Reliability Engineers',
    desc: 'Harness 13-feature ensemble models and a semantic knowledge graph to identify failure patterns across your entire asset base.',
    bullets: ['Cross-domain failure patterns', 'SWRL rule authoring', 'Confidence-scored RCA chains'],
  },
];

const BY_INDUSTRY = [
  {
    href: '/solutions/by-industry/manufacturing',
    title: 'Manufacturing',
    tag: 'CNC · Assembly · Stamping',
    desc: 'Reduce unplanned downtime on production lines by detecting tool wear, thermal anomalies, and spindle faults before they cause scrap or stoppages.',
  },
  {
    href: '/solutions/by-industry/oil-gas',
    title: 'Oil & Gas',
    tag: 'Pumps · Compressors · Pipelines',
    desc: 'Protect rotating equipment in safety-critical environments. Continuous vibration and thermal monitoring with LLM-powered root cause analysis.',
  },
  {
    href: '/solutions/by-industry/utilities',
    title: 'Utilities',
    tag: 'Turbines · Generators · Transformers',
    desc: 'Maintain grid reliability by monitoring thermal, electrical, and mechanical signatures across generation and distribution assets.',
  },
];

export default function SolutionsPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
            Solutions
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            Built for your team.<br className="hidden md:block" /> Ready for your industry.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            DiagAI adapts to the way maintenance, reliability, and operations teams actually work — and to the specific failure modes of your industry.
          </p>
          <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* By Role */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-10">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">By Role</div>
            <h2 className="text-2xl font-bold">Solutions for every stakeholder</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BY_ROLE.map((r) => (
              <Link key={r.href} href={r.href} className="group p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/50 transition-all flex flex-col">
                <h3 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-3">{r.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5 flex-1">{r.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <span className="text-sm font-medium text-emerald-400 group-hover:underline">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* By Industry */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">By Industry</div>
          <h2 className="text-2xl font-bold">Tailored to your sector</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {BY_INDUSTRY.map((i) => (
            <Link key={i.href} href={i.href} className="group p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/50 transition-all flex flex-col">
              <div className="mb-3">
                <h3 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-1">{i.title}</h3>
                <span className="text-xs text-slate-500">{i.tag}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-5">{i.desc}</p>
              <span className="text-sm font-medium text-emerald-400 group-hover:underline">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Not sure where to start?</h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto text-sm">Talk to a DiagAI engineer. We&apos;ll map your asset types and failure modes to the right configuration in under 30 minutes.</p>
          <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
            Book a demo
          </Link>
        </div>
      </section>

    </div>
  );
}
