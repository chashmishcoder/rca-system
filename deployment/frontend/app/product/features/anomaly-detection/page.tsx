import Link from 'next/link';

const METRICS = [
  { label: 'F1 Score', value: '87.3%' },
  { label: 'Precision', value: '91.2%' },
  { label: 'Recall', value: '83.7%' },
  { label: 'Detection latency', value: '<2s' },
];

const HOW = [
  { step: '01', title: 'Feature engineering', desc: '13 engineered features including temp_diff, power, and thermal ratio are computed from raw 5-sensor input.' },
  { step: '02', title: 'Z-score normalisation', desc: 'Each feature is normalised using training-set statistics before inference — preventing scale bias in LSTM reconstruction.' },
  { step: '03', title: 'LSTM reconstruction', desc: 'A (None, 10, 13) autoencoder reconstructs the input window. Elevated reconstruction error signals anomalous behaviour.' },
  { step: '04', title: 'Ensemble scoring', desc: '0.6×LSTM_norm + 0.4×RF_prob = ensemble score. Threshold >0.5 triggers an alert with severity classification.' },
];

export default function AnomalyDetectionPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/product" className="hover:text-emerald-400 transition-colors">Product</Link>
          <span>/</span>
          <span className="text-slate-400">Anomaly Detection</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Feature
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          Anomaly Detection
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          An LSTM autoencoder continuously monitors 13 sensor-derived features and raises precision alerts the moment equipment behaviour deviates from normal — typically in under 2 seconds.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {METRICS.map((m) => (
            <div key={m.label} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">{m.value}</div>
              <div className="text-xs text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>
        <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
          Start Free Trial →
        </Link>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">How it works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {HOW.map((h) => (
              <div key={h.step} className="flex gap-4 p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-400">{h.step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">{h.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Input features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">Input features (13)</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Feature</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                ['air_temperature', 'Raw sensor', 'Ambient air temperature (K)'],
                ['process_temperature', 'Raw sensor', 'Process temperature (K)'],
                ['rotational_speed', 'Raw sensor', 'Spindle RPM'],
                ['torque', 'Raw sensor', 'Torque (Nm)'],
                ['tool_wear', 'Raw sensor', 'Cumulative tool wear (min)'],
                ['temp_diff', 'Engineered', 'process_temp − air_temp'],
                ['power', 'Engineered', 'torque × rotational_speed × constant'],
                ['thermal', 'Engineered', 'temp_diff / process_temp'],
                ['type_H', 'Encoded', 'Machine type high quality'],
                ['type_L', 'Encoded', 'Machine type low quality'],
                ['type_M', 'Encoded', 'Machine type medium quality'],
                ['rpm_torque_ratio', 'Engineered', 'rotational_speed / torque'],
                ['wear_temp_interact', 'Engineered', 'tool_wear × temp_diff'],
              ].map(([name, source, desc]) => (
                <tr key={name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3 font-mono text-emerald-400 text-xs">{name}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{source}</td>
                  <td className="px-5 py-3 text-slate-400">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Severity levels */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Severity classification</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { level: 'Critical', range: '≥ 0.8', color: 'border-red-500/40 bg-red-500/5 text-red-400' },
            { level: 'High', range: '0.6 – 0.8', color: 'border-orange-500/40 bg-orange-500/5 text-orange-400' },
            { level: 'Medium', range: '0.4 – 0.6', color: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-400' },
            { level: 'Normal', range: '< 0.4', color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' },
          ].map((s) => (
            <div key={s.level} className={`p-4 rounded-xl border text-center ${s.color}`}>
              <div className="font-bold mb-1">{s.level}</div>
              <div className="text-xs opacity-80">Score {s.range}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Next feature nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-sm text-slate-500">Next feature</span>
          <Link href="/product/features/multi-agent-rca" className="text-sm font-semibold text-emerald-400 hover:underline">
            Multi-Agent RCA →
          </Link>
        </div>
      </section>

    </div>
  );
}
