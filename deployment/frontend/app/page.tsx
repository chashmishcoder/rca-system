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

const TESTIMONIALS = [
  {
    quote: 'DiagAI cut our unplanned downtime by 58% in the first quarter. The multi-agent RCA is incredibly accurate — it identified a bearing pre-failure that would have cost us $240k.',
    name: 'Rajesh Mehta',
    role: 'Head of Maintenance, Bharat Steel Works',
    initials: 'RM',
  },
  {
    quote: "We integrated the API in two days. The knowledge graph gives our team context they've never had before — not just 'anomaly detected' but exactly why the compressor is failing.",
    name: 'Priya Nair',
    role: 'Plant Manager, IndOil Refineries',
    initials: 'PN',
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now in public beta — free during trial
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.08]">
            Predict failures{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              before they happen
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            DiagAI is a multi-agent AI platform that detects industrial equipment anomalies,
            traces root causes automatically, and recommends action — all in real time.
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

          <p className="text-xs text-slate-600 mt-5">No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
                {s.value}
              </div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              eliminate unplanned downtime
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From raw sensor data to root cause in seconds. Four AI-powered capabilities that work together.
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
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How DiagAI works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From raw sensor stream to actionable maintenance task in 4 automated steps.
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

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by maintenance teams
          </h2>
          <p className="text-slate-400">See what industrial engineers say about DiagAI.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl bg-slate-900 border border-slate-800"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-slate-300 leading-relaxed mb-6 text-sm">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
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
              Ready to stop reactive maintenance?
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              Start your free 14-day trial today. No credit card required. Full platform access from day one.
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
