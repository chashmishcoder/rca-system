import Link from 'next/link';

const STATS = [
  { value: '87.3%', label: 'Anomaly Detection Accuracy' },
  { value: '84.6%', label: 'RCA Success Rate' },
  { value: '<2s', label: 'Detection Latency' },
  { value: '4+', label: 'Specialized AI Agents' },
];

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Anomaly Detection',
    desc: 'LSTM autoencoder trained on industrial sensor data detects deviations in real time — air temp, torque, RPM, tool wear and more.',
    href: '/product/features/anomaly-detection',
    stat: '87.3% F1',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Multi-Agent RCA',
    desc: '4 specialized LangGraph agents — Diagnostic, Reasoning, Planning, and Learning — collaborate to trace the root cause of every fault.',
    href: '/product/features/multi-agent-rca',
    stat: '84.6% accuracy',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4-8 4m16 0c0 2.21-3.582 4-8 4" />
      </svg>
    ),
    title: 'Knowledge Graph',
    desc: 'A semantic ontology of 50+ equipment entities and SWRL rules enables contextual reasoning far beyond simple threshold alerts.',
    href: '/product/features/knowledge-graph',
    stat: '50+ entities',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    title: 'Predictive Analytics',
    desc: 'Ensemble scoring fuses LSTM and Random Forest signals to give an equipment health score that decays in real time as anomalies accumulate.',
    href: '/product/features/predictive-analytics',
    stat: 'Ensemble model',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Ingest Sensor Data',
    desc: 'Push air temperature, RPM, torque, tool wear and 9 other sensor readings via REST API or live stream.',
  },
  {
    num: '02',
    title: 'Detect Anomalies',
    desc: 'The LSTM autoencoder computes reconstruction error in under 2 seconds and raises an alert when thresholds are crossed.',
  },
  {
    num: '03',
    title: 'Trace Root Cause',
    desc: 'LangGraph agents query the knowledge graph, reason over failure patterns, and return a ranked list of probable root causes.',
  },
  {
    num: '04',
    title: 'Act & Prevent',
    desc: 'Receive prioritised maintenance recommendations and push tasks directly to your CMMS or team dashboard.',
  },
];

const VALIDATION = [
  {
    dataset: 'AI4I 2020',
    meta: '10,000 production records · 5 failure modes · UCI ML Repository',
    link: 'https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset',
    results: [
      { label: 'Anomaly detection F1', val: '87.3%' },
      { label: 'RCA success rate', val: '84.6%' },
      { label: 'Precision (failure class)', val: '91.2%' },
    ],
  },
  {
    dataset: 'MetroPT-3',
    meta: 'Air compressor telemetry · Porto Metro fleet · Cross-domain transfer',
    link: 'https://archive.ics.uci.edu/dataset/791/metropt-3+dataset',
    results: [
      { label: 'Pattern transfer rate', val: '74%' },
      { label: 'Cross-domain RCA accuracy', val: '71.8%' },
      { label: 'KG entities transferred', val: '22 / 30' },
    ],
  },
];

export default function Home() {
  return (
    <div className="bg-slate-950 text-slate-100">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-teal-500/6 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            6 research phases &rarr; live API
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.08]">
            Predict failures{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              before they happen
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            LSTM anomaly detection on industrial sensor streams, a semantic knowledge graph of
            equipment failure modes, and four LangGraph agents that trace root causes and explain
            exactly what went wrong — not just that something did.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-base hover:from-emerald-400 hover:to-teal-500 hover:shadow-xl hover:shadow-emerald-500/25 transition-all"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-slate-800 text-slate-300 rounded-xl font-semibold text-base hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
            >
              View Live Demo
            </Link>
          </div>

          <p className="text-xs text-slate-600 mt-5">Free while in beta &middot; No credit card</p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 mb-1">
                {s.value}
              </div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Four components. One pipeline.
          </h2>
          <p className="text-slate-400 max-w-xl">
            Each piece was built separately, validated separately, then wired together. Here&apos;s what each one actually does.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/50 hover:bg-slate-900/80 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  {f.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {f.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                      {f.stat}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The pipeline, end to end</h2>
            <p className="text-slate-400 max-w-xl">
              Sensor reading in, root cause report out. These are the four stages, in order.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />

            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-emerald-700/30 flex items-center justify-center mb-5 relative z-10">
                  <span className="text-lg font-extrabold bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-100 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Validation ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tested on real industrial data</h2>
          <p className="text-slate-400 max-w-xl">
            No synthetic benchmarks. Both datasets are publicly available — you can replicate every number.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {VALIDATION.map((v) => (
            <div key={v.dataset} className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-100 mb-1">{v.dataset}</h3>
                <p className="text-xs text-slate-500 font-mono">{v.meta}</p>
              </div>
              <div className="space-y-3">
                {v.results.map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{r.label}</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-900/60 to-slate-900 border border-emerald-700/30 rounded-3xl" />
          <div className="relative px-10 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              It&apos;s a working system, not a demo.
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              The API is live. The models are trained on real data. Send a sensor reading and get a root cause report back — no setup required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 hover:shadow-xl hover:shadow-emerald-500/30 transition-all"
              >
                Start Free Trial →
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-3.5 bg-slate-800/80 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
