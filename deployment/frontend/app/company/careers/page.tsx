import Link from 'next/link';

const ROLES = [
  {
    title: 'Senior ML Engineer — Anomaly Detection',
    team: 'Research',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Own the anomaly detection pipeline end to end. Improve LSTM autoencoder architecture, tune the ensemble weighting, and research new feature engineering approaches for industrial sensor data.',
    requirements: [
      '4+ years ML engineering experience',
      'Strong PyTorch / TensorFlow background',
      'Experience with time-series anomaly detection',
      'Familiarity with industrial sensor data (vibration, thermal, electrical)',
    ],
  },
  {
    title: 'AI Systems Engineer — LangGraph & Agents',
    team: 'Platform',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Extend and maintain the 4-agent LangGraph RCA pipeline. Design new agent types, improve inter-agent communication, and integrate with the knowledge graph and learning systems.',
    requirements: [
      '3+ years Python engineering experience',
      'Experience with LangChain / LangGraph or similar agent frameworks',
      'Understanding of LLM prompting and evaluation',
      'Production API development (FastAPI preferred)',
    ],
  },
  {
    title: 'Knowledge Graph & Ontology Engineer',
    team: 'Research',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Expand the DiagAI OWL ontology, author new SWRL rules for additional failure modes, and build tooling to help customers extend the knowledge graph for their own equipment types.',
    requirements: [
      'Experience with OWL, SWRL, or RDF/SPARQL',
      'Background in industrial systems or reliability engineering a strong plus',
      'Comfortable working at the intersection of symbolic AI and ML',
    ],
  },
  {
    title: 'Full-Stack Engineer — Dashboard & API',
    team: 'Platform',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Build new dashboard features, improve the REST API, and develop the integration layer that connects DiagAI to SCADA, CMMS, and ERP systems.',
    requirements: [
      '3+ years full-stack experience',
      'Next.js / React + TypeScript proficiency',
      'FastAPI or similar Python web framework experience',
      'Interest in industrial IoT or operations technology',
    ],
  },
  {
    title: 'Developer Advocate',
    team: 'Go-To-Market',
    location: 'Remote',
    type: 'Full-time',
    desc: "Help engineers get the most out of DiagAI. Write technical documentation, create integration examples, run webinars, and be the voice of our developer community.",
    requirements: [
      'Background in engineering or software development',
      'Strong technical writing skills',
      'Comfortable with REST APIs and code examples',
      'Passion for industrial technology and manufacturing',
    ],
  },
];

const TEAM_COLORS: Record<string, string> = {
  Research: 'bg-emerald-500/10 text-emerald-400',
  Platform: 'bg-teal-500/10 text-teal-400',
  'Go-To-Market': 'bg-cyan-500/10 text-cyan-400',
};

const PERKS = [
  { title: 'Fully remote', desc: 'Work from anywhere. We are async-first and have no office.' },
  { title: 'Equity', desc: 'Meaningful early-stage equity. We are building something that matters and want the team to share in the outcome.' },
  { title: 'Research time', desc: '20% of your time is yours for relevant research — publish papers, build side tools, explore new models.' },
  { title: 'Hardware budget', desc: 'Laptop, GPU, and peripherals of your choice on day one.' },
  { title: 'Learning budget', desc: '$3,000/year for conferences, courses, and books. No approval required.' },
  { title: 'No on-call rota (yet)', desc: "We're still small and deploy carefully. You won't be paged at 3am for a Kubernetes incident." },
];

export default function CareersPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/company" className="hover:text-emerald-400 transition-colors">Company</Link>
          <span>/</span>
          <span className="text-slate-400">Careers</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Careers
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          Help us end<br className="hidden md:block" /> unplanned downtime
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-3 leading-relaxed">
          We are a small, technical team solving a genuinely hard problem — combining deep learning, multi-agent reasoning, and knowledge graph semantics into production industrial software.
        </p>
        <p className="text-slate-500 text-sm mb-8">
          All roles are fully remote.{' '}
          <span className="text-emerald-400 font-medium">{ROLES.length} open positions.</span>
        </p>
        <Link href="#open-roles" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
          See open roles ↓
        </Link>
      </section>

      {/* Perks */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">Why DiagAI</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {PERKS.map((p) => (
              <div key={p.title} className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-emerald-400 mb-1.5 text-sm">{p.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="max-w-5xl mx-auto px-6 py-16" id="open-roles">
        <h2 className="text-2xl font-bold mb-8">Open roles</h2>
        <div className="space-y-5">
          {ROLES.map((role) => (
            <div key={role.title} className="p-7 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex flex-col md:flex-row md:items-start gap-4 mb-5">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-100 text-lg">{role.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${TEAM_COLORS[role.team]}`}>{role.team}</span>
                    <span className="px-2 py-0.5 rounded text-xs text-slate-500 bg-slate-800 border border-slate-700">{role.location}</span>
                    <span className="px-2 py-0.5 rounded text-xs text-slate-500 bg-slate-800 border border-slate-700">{role.type}</span>
                  </div>
                </div>
                <Link
                  href="/company/contact"
                  className="shrink-0 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm font-medium hover:border-emerald-600 hover:text-emerald-400 transition-all"
                >
                  Apply →
                </Link>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">{role.desc}</p>
              <ul className="space-y-1.5">
                {role.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* No role? */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 text-center">
          <h2 className="text-xl font-bold mb-2">Don&apos;t see the right role?</h2>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            If you are passionate about industrial AI and think you can contribute, send us a note. We read every message.
          </p>
          <Link href="/company/contact" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 transition-all">
            Send an intro →
          </Link>
        </div>
      </section>

    </div>
  );
}
