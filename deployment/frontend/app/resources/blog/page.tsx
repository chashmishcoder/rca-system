import Link from 'next/link';

const POSTS = [
  {
    slug: 'why-threshold-monitoring-fails-2026',
    title: 'Why threshold-based monitoring fails in 2026',
    date: 'April 28, 2026',
    readTime: '8 min',
    tag: 'Predictive Maintenance',
    tagColor: 'bg-emerald-500/10 text-emerald-400',
    excerpt: "Setting a torque limit of 60Nm and waiting for an alarm isn't predictive maintenance — it's reactive maintenance with extra steps. Here's why ML-based detection changes everything.",
    featured: true,
  },
  {
    slug: 'langgraph-vs-single-agent-rca-benchmark',
    title: 'LangGraph vs. single-agent RCA: a benchmark',
    date: 'April 20, 2026',
    readTime: '12 min',
    tag: 'AI & LLMs',
    tagColor: 'bg-teal-500/10 text-teal-400',
    excerpt: "We ran 500 historical fault scenarios through a single-prompt LLM and through DiagAI's 4-agent LangGraph pipeline. The results were decisive — and the reasons are instructive.",
    featured: true,
  },
  {
    slug: 'lstm-autoencoder-industrial-anomaly-detection',
    title: 'LSTM autoencoders for industrial anomaly detection',
    date: 'April 12, 2026',
    readTime: '15 min',
    tag: 'AI & LLMs',
    tagColor: 'bg-teal-500/10 text-teal-400',
    excerpt: "A deep dive into the architecture behind DiagAI's anomaly detection: how LSTM reconstruction error captures temporal dependencies that z-score methods miss.",
    featured: false,
  },
  {
    slug: 'knowledge-graph-maintenance-expert-systems',
    title: 'Why knowledge graphs beat pure ML for root cause analysis',
    date: 'April 5, 2026',
    readTime: '10 min',
    tag: 'Predictive Maintenance',
    tagColor: 'bg-emerald-500/10 text-emerald-400',
    excerpt: 'ML models learn correlations; knowledge graphs encode causation. For RCA you need both — and SWRL rules are the bridge between the two.',
    featured: false,
  },
  {
    slug: 'ai4i-2020-dataset-guide',
    title: 'A practitioner\'s guide to the AI4I 2020 dataset',
    date: 'March 28, 2026',
    readTime: '9 min',
    tag: 'Predictive Maintenance',
    tagColor: 'bg-emerald-500/10 text-emerald-400',
    excerpt: "The AI4I 2020 predictive maintenance dataset is the standard benchmark for industrial ML. Here's what the 14 features mean, what the 5 failure modes look like, and how to use it properly.",
    featured: false,
  },
  {
    slug: 'groq-llama-industrial-rca',
    title: 'Using Groq Llama 3.3 70B for industrial root cause analysis',
    date: 'March 18, 2026',
    readTime: '11 min',
    tag: 'AI & LLMs',
    tagColor: 'bg-teal-500/10 text-teal-400',
    excerpt: "Sub-second LLM inference changes what's possible in real-time industrial diagnostics. We benchmark Groq's Llama 3.3 70B against GPT-4o on structured fault-tree reasoning tasks.",
    featured: false,
  },
  {
    slug: 'predictive-maintenance-roi-calculation',
    title: 'How to calculate the ROI of predictive maintenance',
    date: 'March 10, 2026',
    readTime: '7 min',
    tag: 'Business',
    tagColor: 'bg-cyan-500/10 text-cyan-400',
    excerpt: "A step-by-step framework for quantifying the financial return of a predictive maintenance programme — including downtime cost modelling, PM reduction, and break-even analysis.",
    featured: false,
  },
  {
    slug: 'diagAI-phase5-langgraph-launch',
    title: 'Product update: LangGraph multi-agent pipeline now in production',
    date: 'March 1, 2026',
    readTime: '4 min',
    tag: 'Product Updates',
    tagColor: 'bg-purple-500/10 text-purple-400',
    excerpt: 'We shipped the full 4-agent LangGraph RCA pipeline to production. Here\'s what changed, what improved, and what\'s coming next.',
    featured: false,
  },
];

const ALL_TAGS = ['All', 'Predictive Maintenance', 'AI & LLMs', 'Business', 'Product Updates'];

export default function BlogPage() {
  const featured = POSTS.filter((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/resources" className="hover:text-emerald-400 transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-slate-400">Blog</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Blog
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">The DiagAI Blog</h1>
        <p className="text-lg text-slate-400 max-w-xl mb-8">
          Technical deep dives, predictive maintenance strategy, and product updates from the DiagAI team.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag, i) => (
            <span
              key={tag}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                i === 0
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Featured posts */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((post) => (
            <article key={post.slug} className="group p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/50 transition-all flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${post.tagColor}`}>{post.tag}</span>
                <span className="text-xs text-slate-500 ml-auto">{post.readTime} read</span>
              </div>
              <h2 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors mb-3 leading-snug">{post.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-5">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{post.date}</span>
                <span className="text-sm font-medium text-emerald-400 group-hover:underline">Read more →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* All posts */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <h2 className="text-lg font-bold mb-6">All articles</h2>
          <div className="space-y-3">
            {rest.map((post) => (
              <article key={post.slug} className="group flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-700/40 transition-all">
                <div className="md:w-36 shrink-0 flex md:flex-col gap-2 md:gap-1">
                  <span className={`self-start px-2 py-0.5 rounded text-xs font-medium ${post.tagColor}`}>{post.tag}</span>
                  <span className="text-xs text-slate-600">{post.date}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors mb-1">{post.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
                <div className="shrink-0 flex items-center gap-3 text-xs text-slate-600">
                  <span>{post.readTime} read</span>
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="max-w-5xl mx-auto px-6 py-14 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 p-10 text-center">
          <h2 className="text-xl font-bold mb-2">Get new articles in your inbox</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            One email per week — technical deep dives, case studies, and product updates. No spam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
