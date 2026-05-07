import Link from 'next/link';

const TIMELINE = [
  { year: '2024', event: 'Research begins. First LSTM autoencoder trained on the AI4I 2020 dataset to detect manufacturing anomalies.' },
  { year: 'Q1 2025', event: 'Phases 1–3 complete: feature engineering pipeline, anomaly detection system, and OWL/SWRL knowledge graph ontology.' },
  { year: 'Q2 2025', event: 'Phase 4: Knowledge graph embeddings and cross-domain failure pattern transfer learning across industrial datasets.' },
  { year: 'Q3 2025', event: 'Phase 5: LangGraph 4-agent RCA pipeline (Diagnostic → Reasoning → Planning → Learning) ships. 84.6% success rate on validation.' },
  { year: 'Q4 2025', event: 'Phase 6: Full evaluation suite — ablation studies, cross-domain benchmarks, F1 lifted from 0.542 to 0.947 with ensemble scoring.' },
  { year: 'Q1 2026', event: 'Production deployment on Render. REST API, MongoDB Atlas backend, and Next.js dashboard go live.' },
  { year: 'May 2026', event: 'DiagAI platform launched publicly with full product documentation and API access.' },
];

const VALUES = [
  {
    title: 'Explainability over black boxes',
    desc: 'Every anomaly score, RCA report, and maintenance recommendation includes a traceable reasoning chain. You always know why DiagAI flagged something.',
  },
  {
    title: 'Real data, real validation',
    desc: 'Models are trained and benchmarked on established industrial datasets — AI4I 2020 and MetroPT — not synthetic toy examples.',
  },
  {
    title: 'Engineers first',
    desc: 'DiagAI is designed for the people who actually fix machines, not for dashboards nobody reads. Every feature starts with a maintenance engineer use case.',
  },
  {
    title: 'Continuous improvement',
    desc: 'The Learning Agent is a core system component, not a marketing claim. Feedback from every confirmed diagnosis improves future accuracy for your fleet.',
  },
];

const TECH_STACK = [
  { label: 'Anomaly Detection', value: 'LSTM Autoencoder + Random Forest ensemble (F1 0.947)' },
  { label: 'Agentic Reasoning', value: 'LangGraph 4-agent pipeline · Groq Llama 3.3 70B' },
  { label: 'Knowledge Graph', value: 'OWL/SWRL ontology · Neo4j · semantic embeddings' },
  { label: 'Backend', value: 'FastAPI · MongoDB Atlas · Python 3.11' },
  { label: 'Frontend', value: 'Next.js 14 · TypeScript · Tailwind CSS' },
  { label: 'Infrastructure', value: 'Render · Docker · REST API' },
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
          Built by one engineer,<br className="hidden md:block" /> across six research phases
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
          DiagAI is a solo research project by <span className="text-slate-200 font-medium">Omkar Thorve</span> — built to answer one question: can a combination of LSTM anomaly detection, multi-agent LLM reasoning, and semantic knowledge graphs produce better root cause analysis than a human expert working alone? After two years and six research phases, the answer is yes.
        </p>
      </section>

      {/* Researcher profile */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">The researcher</h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-100 mb-0.5">Omkar Thorve</h3>
              <p className="text-sm text-emerald-400 mb-4">Researcher · Engineer · Builder</p>
              <p className="text-slate-400 leading-relaxed mb-5">
                Designed and built the entire DiagAI stack end-to-end — from data preprocessing and LSTM autoencoder training through knowledge graph ontology design, LangGraph agentic pipelines, REST API, and the production dashboard. Every phase was researched, implemented, and validated independently.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Industrial ML', 'Agentic AI', 'Knowledge Graphs', 'FastAPI', 'Next.js', 'LangGraph', 'LSTM', 'MongoDB'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md text-xs bg-slate-800 border border-slate-700 text-slate-400">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">The mission</h2>
        <p className="text-slate-400 max-w-2xl leading-relaxed text-lg">
          Industrial equipment should never fail without warning. DiagAI is the AI layer that makes predictive maintenance accessible to every manufacturing plant, oil platform, and utility grid — not just those with dedicated data science teams.
        </p>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">Technology</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {TECH_STACK.map((t) => (
              <div key={t.label} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex gap-4">
                <div className="shrink-0 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
                <div>
                  <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">{t.label}</p>
                  <p className="text-sm text-slate-400">{t.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">Principles</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-emerald-400 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">Research journey</h2>
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
