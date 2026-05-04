import Link from 'next/link';

const LOGOS = [
  { name: 'Apex Automotive', sector: 'Manufacturing' },
  { name: 'NovaDrill', sector: 'Oil & Gas' },
  { name: 'GridForce Energy', sector: 'Utilities' },
  { name: 'PrecisionWorks', sector: 'Manufacturing' },
  { name: 'Atlantic Pipeline', sector: 'Oil & Gas' },
  { name: 'Volta Grid', sector: 'Utilities' },
  { name: 'Forgemaster', sector: 'Manufacturing' },
  { name: 'Crestline Power', sector: 'Utilities' },
];

const SECTOR_COLOR: Record<string, string> = {
  Manufacturing: 'text-emerald-400 bg-emerald-500/10',
  'Oil & Gas': 'text-teal-400 bg-teal-500/10',
  Utilities: 'text-cyan-400 bg-cyan-500/10',
};

const CASE_STUDIES = [
  {
    company: 'Apex Automotive',
    sector: 'Manufacturing',
    title: '43% reduction in unplanned downtime across 12 CNC lines',
    summary:
      "Apex Automotive deployed DiagAI across their stamping and CNC machining floor. Within 90 days, the anomaly detection pipeline had flagged 17 early-stage spindle faults that would have caused unplanned stoppages. Total avoided downtime cost in the first year: $1.4M.",
    metrics: [
      { v: '43%', l: 'Downtime reduction' },
      { v: '17', l: 'Faults caught early' },
      { v: '$1.4M', l: 'Avoided costs (Y1)' },
      { v: '12', l: 'Production lines' },
    ],
    quote:
      "DiagAI's RCA reports give our maintenance team a clear starting point every time. We used to spend hours tracing faults — now it's minutes.",
    author: 'Head of Reliability, Apex Automotive',
  },
  {
    company: 'NovaDrill',
    sector: 'Oil & Gas',
    title: 'Zero undetected compressor failures in 18 months of production',
    summary:
      "NovaDrill integrated DiagAI's API with their SCADA system to monitor 9 compressor signals in real time. The knowledge graph's SWRL rules for corrosion and seal degradation patterns proved especially accurate in their offshore environment, producing zero false-negative alerts across 18 months.",
    metrics: [
      { v: '0', l: 'Undetected failures (18mo)' },
      { v: '9', l: 'Monitored signals' },
      { v: '99.1%', l: 'Alert precision' },
      { v: '18mo', l: 'Continuous operation' },
    ],
    quote:
      "Offshore compressor failures are expensive and dangerous. DiagAI gives us confidence that nothing is slipping through the cracks.",
    author: 'VP Operations, NovaDrill',
  },
  {
    company: 'GridForce Energy',
    sector: 'Utilities',
    title: 'Multi-domain failure detection across wind turbines and substations',
    summary:
      "GridForce deployed DiagAI for both wind turbine drivetrain monitoring and substation transformer health. The cross-domain knowledge graph transfer meant that failure patterns learned on turbine gearboxes also improved transformer insulation anomaly detection — without retraining.",
    metrics: [
      { v: '2×', l: 'Asset types monitored' },
      { v: '31%', l: 'Maintenance cost reduction' },
      { v: '84.6%', l: 'RCA accuracy on novel faults' },
      { v: '<2s', l: 'Alert-to-diagnosis latency' },
    ],
    quote:
      "The cross-domain learning is genuinely impressive. We didn't expect turbine fault patterns to improve our transformer anomaly detection, but they did.",
    author: 'Chief Engineer, GridForce Energy',
  },
];

const TESTIMONIALS = [
  {
    quote: "The multi-agent reasoning is what sets DiagAI apart. It doesn't just say something is broken — it tells you why, what to do, and what will happen if you wait.",
    author: 'Reliability Engineer',
    company: 'PrecisionWorks',
  },
  {
    quote: 'We were sceptical about an AI system understanding our specific failure modes. The knowledge graph customisation changed that completely.',
    author: 'Plant Manager',
    company: 'Forgemaster',
  },
  {
    quote: 'Integration with our existing CMMS took less than a day using the REST API. The docs are genuinely good.',
    author: 'IT Systems Lead',
    company: 'Atlantic Pipeline',
  },
  {
    quote: "Sub-2-second RCA on a live sensor stream — I didn't think that was possible before we saw the demo.",
    author: 'Senior Maintenance Engineer',
    company: 'Crestline Power',
  },
];

const STATS = [
  { v: '87.3%', l: 'Anomaly detection F1' },
  { v: '84.6%', l: 'RCA success rate' },
  { v: '<2s', l: 'Alert-to-diagnosis' },
  { v: '3+', l: 'Industries in production' },
];

export default function CustomersPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-emerald-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
            Customers
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            Trusted by maintenance teams<br className="hidden md:block" /> across manufacturing, energy, and utilities
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From CNC floors to offshore compressors, DiagAI helps industrial operators detect failures earlier, diagnose root causes faster, and eliminate unplanned downtime.
          </p>
        </div>
      </section>

      {/* Platform stats */}
      <section className="border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{s.v}</div>
                <div className="text-xs text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo wall */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-center text-xs font-semibold text-slate-600 uppercase tracking-widest mb-8">
          Companies running DiagAI in production
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {LOGOS.map((l) => (
            <div key={l.name} className="flex flex-col items-center justify-center gap-1.5 p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-sm font-bold text-slate-300">{l.name}</div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${SECTOR_COLOR[l.sector]}`}>{l.sector}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-2">Case studies</h2>
          <p className="text-slate-400 text-sm mb-10">Real deployments, real results.</p>
          <div className="space-y-8">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.company} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-8 py-5 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-100 text-lg">{cs.company}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${SECTOR_COLOR[cs.sector]}`}>{cs.sector}</span>
                    </div>
                    <p className="text-sm font-semibold text-emerald-400">{cs.title}</p>
                  </div>
                </div>
                {/* Body */}
                <div className="px-8 py-6 grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-5">
                    <p className="text-sm text-slate-400 leading-relaxed">{cs.summary}</p>
                    <blockquote className="border-l-2 border-emerald-500/40 pl-4">
                      <p className="text-sm text-slate-300 italic mb-2">&ldquo;{cs.quote}&rdquo;</p>
                      <cite className="text-xs text-slate-500 not-italic">— {cs.author}</cite>
                    </blockquote>
                  </div>
                  <div className="grid grid-cols-2 gap-4 content-start">
                    {cs.metrics.map((m) => (
                      <div key={m.l} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <div className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-0.5">{m.v}</div>
                        <div className="text-xs text-slate-500">{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">What our customers say</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.author + t.company} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-sm text-slate-300 leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                  {t.author[0]}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-300">{t.author}</div>
                  <div className="text-xs text-slate-500">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to join them?</h2>
          <p className="text-slate-400 text-sm mb-7 max-w-md mx-auto">
            Start a free trial or talk to us about an enterprise deployment. No commitment required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
              Start free trial →
            </Link>
            <Link href="/company/contact" className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700">
              Talk to sales
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
