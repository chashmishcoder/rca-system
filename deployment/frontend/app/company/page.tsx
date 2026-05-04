import Link from 'next/link';

const LINKS = [
  {
    href: '/company/about',
    title: 'About Us',
    desc: 'Our mission, the team behind DiagAI, and how we built an AI-native predictive maintenance platform from first principles.',
    cta: 'Meet the team →',
  },
  {
    href: '/company/careers',
    title: 'Careers',
    desc: "We're a small, technical team solving a hard problem in industrial AI. If that sounds interesting, we'd love to hear from you.",
    cta: 'View open roles →',
  },
  {
    href: '/company/contact',
    title: 'Contact',
    desc: 'Questions about pricing, enterprise deployments, partnerships, or the API — reach us directly.',
    cta: 'Get in touch →',
  },
];

const STATS = [
  { v: '2024', l: 'Founded' },
  { v: '87.3%', l: 'Anomaly F1 score' },
  { v: '4+', l: 'Agent types in pipeline' },
  { v: '3', l: 'Industries served' },
];

export default function CompanyPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
            Company
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            We&apos;re building the AI layer<br className="hidden md:block" /> for industrial maintenance
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            DiagAI combines LSTM anomaly detection, multi-agent LangGraph reasoning, and semantic knowledge graphs into a single platform — making expert-level root cause analysis accessible to every maintenance team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/company/about" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
              Our story →
            </Link>
            <Link href="/company/careers" className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700">
              We&apos;re hiring
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Sub-page cards */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="group p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/50 transition-all flex flex-col">
              <h2 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-3">{l.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-5">{l.desc}</p>
              <span className="text-sm font-medium text-emerald-400 group-hover:underline">{l.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission statement */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 p-10 text-center">
          <blockquote className="text-xl font-semibold text-slate-100 max-w-2xl mx-auto leading-relaxed mb-4">
            &ldquo;Industrial equipment should never fail without warning. Our goal is to make that true for every manufacturer, operator, and utility on the planet.&rdquo;
          </blockquote>
          <p className="text-sm text-slate-500">— DiagAI founding team</p>
        </div>
      </section>

    </div>
  );
}
