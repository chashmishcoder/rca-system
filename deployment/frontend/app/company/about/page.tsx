import Link from 'next/link';

const TEAM = [
  {
    name: 'Omkar Thorve',
    role: 'Founder & Lead Engineer',
    bio: 'Built the full DiagAI platform — from LSTM autoencoder to LangGraph multi-agent pipeline. Focus areas: industrial ML, agentic AI systems, and knowledge graph reasoning.',
    areas: ['Anomaly Detection', 'LangGraph', 'Knowledge Graphs'],
  },
  {
    name: 'AI Research',
    role: 'ML & Reasoning Systems',
    bio: 'Research into LSTM reconstruction error dynamics, ensemble calibration, and LLM-guided fault-tree traversal for industrial root cause analysis.',
    areas: ['LSTM Autoencoders', 'Groq Llama 3.3 70B', 'OWL/SWRL Ontologies'],
  },
  {
    name: 'Platform Engineering',
    role: 'Backend & Infra',
    bio: 'FastAPI backend, MongoDB Atlas, Render deployment pipeline, and the REST API that connects DiagAI to industrial control systems worldwide.',
    areas: ['FastAPI', 'MongoDB Atlas', 'REST API'],
  },
];

const TIMELINE = [
  { year: '2024', event: 'DiagAI research begins. First LSTM autoencoder trained on AI4I 2020 dataset.' },
  { year: 'Q1 2025', event: 'Phase 1–3 complete: feature engineering, anomaly detection pipeline, and knowledge graph ontology shipped.' },
  { year: 'Q2 2025', event: 'Phase 4: Knowledge graph embeddings and cross-domain failure pattern transfer learning.' },
  { year: 'Q3 2025', event: 'Phase 5: LangGraph 4-agent RCA pipeline goes into production. 84.6% RCA success rate on validation set.' },
  { year: 'Q4 2025', event: 'Phase 6: Full evaluation suite — ablation studies, cross-domain benchmarks, and performance metrics published.' },
  { year: 'Q1 2026', event: 'Production deployment on Render. REST API, MongoDB Atlas backend, and Next.js dashboard go live.' },
  { year: 'May 2026', event: 'DiagAI SaaS platform launches publicly. Pricing, marketing site, and full product documentation released.' },
];

const VALUES = [
  {
    title: 'Explainability over black boxes',
    desc: "Every anomaly score, RCA report, and maintenance recommendation includes a traceable reasoning chain. You should always know why DiagAI flagged something.",
  },
  {
    title: 'Real data, real validation',
    desc: 'Our models are trained and benchmarked on established industrial datasets — AI4I 2020, MetroPT — not synthetic toy examples.',
  },
  {
    title: 'Engineers first',
    desc: 'DiagAI is designed for the people who actually fix machines, not for dashboards that no one reads. Every feature starts with a maintenance engineer use case.',
  },
  {
    title: 'Continuous improvement',
    desc: "The Learning Agent is a core system component, not a marketing claim. Feedback from every confirmed diagnosis improves future accuracy for your fleet.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/company" className="hover:text-emerald-400 transition-colors">Company</Link>
          <span>/</span>
          <span className="text-slate-400">About</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          About DiagAI
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          Built by engineers,<br className="hidden md:block" /> for engineers
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
          DiagAI started as a research project to answer one question: can a combination of LSTM anomaly detection, multi-agent LLM reasoning, and semantic knowledge graphs produce better root cause analysis than a human expert working alone? After two years and six research phases, the answer is yes — and we turned it into a product.
        </p>
      </section>

      {/* Mission */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-6">Our mission</h2>
          <p className="text-slate-400 max-w-2xl leading-relaxed text-lg">
            Industrial equipment should never fail without warning. We&apos;re building the AI layer that makes predictive maintenance accessible to every manufacturing plant, oil platform, and utility grid — not just those with dedicated data science teams.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">How we work</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-emerald-400 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">The team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map((t) => (
              <div key={t.name} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">{t.name[0]}</span>
                </div>
                <h3 className="font-bold text-slate-100 mb-0.5">{t.name}</h3>
                <div className="text-xs text-emerald-400 mb-3">{t.role}</div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{t.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {t.areas.map((a) => (
                    <span key={a} className="px-2 py-0.5 rounded-md text-xs bg-slate-800 border border-slate-700 text-slate-400">{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">Our journey</h2>
        <div className="relative space-y-4">
          <div className="absolute left-16 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/30 to-transparent hidden md:block" />
          {TIMELINE.map((t) => (
            <div key={t.year} className="flex gap-6 items-start">
              <div className="shrink-0 w-14 text-right">
                <span className="text-xs font-bold text-emerald-400">{t.year}</span>
              </div>
              <div className="shrink-0 w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500 mt-0.5 relative z-10 hidden md:block" />
              <p className="text-sm text-slate-400 leading-relaxed pb-4 border-b border-slate-800/60 flex-1">{t.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/company" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Company
          </Link>
          <Link href="/company/careers" className="text-sm font-semibold text-emerald-400 hover:underline">
            Careers →
          </Link>
        </div>
      </section>

    </div>
  );
}
