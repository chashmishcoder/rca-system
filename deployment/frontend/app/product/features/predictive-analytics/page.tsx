import Link from 'next/link';

const SCORING = [
  { label: 'LSTM score weight', value: '60%', desc: 'Reconstruction error normalised to [0,1]' },
  { label: 'RF score weight', value: '40%', desc: 'Random Forest anomaly probability' },
  { label: 'Anomaly threshold', value: '0.5', desc: 'Ensemble score that triggers an alert' },
  { label: 'Health decay rate', value: 'Up to −10 pts', desc: 'Per critical anomaly event' },
];

export default function PredictiveAnalyticsPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/product" className="hover:text-emerald-400 transition-colors">Product</Link>
          <span>/</span>
          <span className="text-slate-400">Predictive Analytics</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Feature
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          Predictive Analytics
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Equipment health scores update in real time as sensor readings are ingested. Trend-based forecasting flags degradation trajectories before they cross failure thresholds — giving your team time to act.
        </p>
        <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
          Start Free Trial →
        </Link>
      </section>

      {/* Ensemble scoring */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-4">Ensemble scoring formula</h2>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-8 font-mono text-center">
            <span className="text-emerald-400 text-xl">score</span>
            <span className="text-slate-400 text-xl"> = </span>
            <span className="text-teal-400 text-xl">0.6</span>
            <span className="text-slate-400 text-xl"> × </span>
            <span className="text-emerald-400 text-xl">LSTM_norm</span>
            <span className="text-slate-400 text-xl"> + </span>
            <span className="text-teal-400 text-xl">0.4</span>
            <span className="text-slate-400 text-xl"> × </span>
            <span className="text-emerald-400 text-xl">RF_prob</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {SCORING.map((s) => (
              <div key={s.label} className="flex items-start gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="shrink-0 text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div>
                  <div className="font-semibold text-slate-200 text-sm mb-0.5">{s.label}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health decay */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">Equipment health model</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-3">Health score decay</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Each piece of equipment starts at 100% health. Every anomaly event decays the score proportionally to severity — critical anomalies deduct up to 10 points, medium anomalies up to 4 points.
            </p>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Critical anomaly', decay: '−10 pts', color: 'text-red-400' },
                { label: 'High anomaly', decay: '−7 pts', color: 'text-orange-400' },
                { label: 'Medium anomaly', decay: '−4 pts', color: 'text-yellow-400' },
                { label: 'Normal reading', decay: '0 pts', color: 'text-emerald-400' },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">{r.label}</span>
                  <span className={`font-mono font-bold ${r.color}`}>{r.decay}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-3">Dashboard visibility</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Every health score is displayed in the fleet dashboard alongside trend sparklines. Operators can see at a glance which machines need attention and which are operating normally.
            </p>
            <ul className="space-y-2">
              {[
                'Fleet-wide health overview',
                'Per-machine trend chart',
                'Alert history with timestamps',
                'Maintenance task integration',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="inline-block mt-5 text-sm font-semibold text-emerald-400 hover:underline">
              View live dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/product/features/knowledge-graph" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Knowledge Graph
          </Link>
          <Link href="/product/api" className="text-sm font-semibold text-emerald-400 hover:underline">
            API →
          </Link>
        </div>
      </section>

    </div>
  );
}
