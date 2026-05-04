import Link from 'next/link';

const SECTIONS = [
  {
    href: '/resources/docs',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Documentation',
    desc: 'Getting started guides, deployment tutorials, and configuration references for every DiagAI capability.',
    links: ['Quick Start', 'Sensor Ingest Guide', 'RCA Workflow', 'Knowledge Graph Setup'],
  },
  {
    href: '/resources/api-reference',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    title: 'API Reference',
    desc: 'Complete REST API documentation with request/response schemas, authentication, and code examples.',
    links: ['Authentication', 'Sensor Endpoints', 'Alert Endpoints', 'Maintenance Endpoints'],
  },
  {
    href: '/resources/blog',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
    title: 'Blog',
    desc: 'Deep dives on predictive maintenance, AI for industrial operations, and DiagAI product updates.',
    links: ['Latest Articles', 'Predictive Maintenance', 'AI & LLMs', 'Product Updates'],
  },
];

const POPULAR = [
  { href: '/resources/docs', label: 'Quick Start — ingest your first sensor reading', tag: 'Docs' },
  { href: '/resources/docs', label: 'How the LSTM + RF ensemble works', tag: 'Docs' },
  { href: '/resources/api-reference', label: 'POST /api/sensor/ingest — full reference', tag: 'API' },
  { href: '/resources/api-reference', label: 'Authentication & API keys', tag: 'API' },
  { href: '/resources/blog', label: 'Why threshold-based monitoring fails in 2026', tag: 'Blog' },
  { href: '/resources/blog', label: 'LangGraph vs. single-agent RCA: a benchmark', tag: 'Blog' },
];

const TAG_COLORS: Record<string, string> = {
  Docs: 'bg-emerald-500/10 text-emerald-400',
  API: 'bg-teal-500/10 text-teal-400',
  Blog: 'bg-cyan-500/10 text-cyan-400',
};

export default function ResourcesPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
            Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            Everything you need<br className="hidden md:block" /> to succeed with DiagAI
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            From first sensor reading to full fleet deployment — documentation, API reference, and technical articles to guide you every step of the way.
          </p>
        </div>
      </section>

      {/* Section cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="group p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/50 transition-all flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                {s.icon}
              </div>
              <h2 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-2">{s.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-5 flex-1">{s.desc}</p>
              <ul className="space-y-1 mb-5">
                {s.links.map((l) => (
                  <li key={l} className="text-xs text-slate-500">{l}</li>
                ))}
              </ul>
              <span className="text-sm font-medium text-emerald-400 group-hover:underline">Browse {s.title} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular articles */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">Popular right now</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {POPULAR.map((p) => (
              <Link key={p.label} href={p.href} className="group flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-700/40 transition-all">
                <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${TAG_COLORS[p.tag]}`}>{p.tag}</span>
                <span className="text-sm text-slate-300 group-hover:text-emerald-400 transition-colors flex-1">{p.label}</span>
                <svg className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 p-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Can&apos;t find what you need?</h2>
            <p className="text-slate-300 text-sm max-w-md">
              Our engineering team responds to all support enquiries within 24 hours on the Professional plan and 4 hours on Enterprise.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/signup" className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 transition-all">
              Contact Support
            </Link>
            <Link href="/resources/docs" className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all border border-slate-700">
              Browse Docs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
