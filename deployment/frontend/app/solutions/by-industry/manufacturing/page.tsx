import Link from 'next/link';

const FAILURE_MODES = [
  { mode: 'Tool wear failure', signal: 'tool_wear + torque anomaly', severity: 'High' },
  { mode: 'Heat dissipation failure', signal: 'temp_diff + RPM anomaly', severity: 'Critical' },
  { mode: 'Power failure', signal: 'power + torque ensemble', severity: 'High' },
  { mode: 'Overstrain failure', signal: 'RPM + torque z-score', severity: 'Medium' },
  { mode: 'Random mechanical failure', signal: 'Multi-feature LSTM spike', severity: 'Critical' },
];

const SEVERITY_COLORS: Record<string, string> = {
  Critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  High: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
};

export default function ManufacturingPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/solutions" className="hover:text-emerald-400 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-slate-400">Manufacturing</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          By Industry · Manufacturing
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          Predictive maintenance<br className="hidden md:block" /> for manufacturing
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          From CNC machining centres to stamping lines and assembly robots — DiagAI monitors the sensor signatures that precede the 5 most common manufacturing failure modes and alerts your team before production stops.
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {['CNC Machining', 'Assembly Lines', 'Stamping', 'Injection Moulding', 'Robotic Arms'].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-400">{tag}</span>
          ))}
        </div>
        <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
          Start Free Trial →
        </Link>
      </section>

      {/* Failure modes table */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-3">Failure modes DiagAI detects</h2>
          <p className="text-slate-400 text-sm mb-8">Trained on the AI4I 2020 predictive maintenance dataset — 10,000+ real CNC machine readings.</p>
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Failure Mode</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Detection Signal</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Default Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {FAILURE_MODES.map((f) => (
                  <tr key={f.mode} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-200">{f.mode}</td>
                    <td className="px-5 py-3 font-mono text-xs text-emerald-400">{f.signal}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${SEVERITY_COLORS[f.severity]}`}>{f.severity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works for manufacturing */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10">Deployment in 3 steps</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Connect sensors', desc: 'Push air temp, process temp, RPM, torque, and tool wear readings via REST API. Batch CSV import also supported.' },
            { step: '02', title: 'Calibrate thresholds', desc: 'DiagAI auto-tunes anomaly thresholds from your first 500 readings. Override any value with machine-specific limits.' },
            { step: '03', title: 'Receive alerts', desc: 'Anomaly alerts appear in the dashboard and can be forwarded to Slack, email, or your CMMS via webhook.' },
          ].map((s) => (
            <div key={s.step} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <span className="text-xs font-bold text-emerald-400">{s.step}</span>
              </div>
              <h3 className="font-bold text-slate-100 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/solutions/by-role/reliability-engineers" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Reliability Engineers
          </Link>
          <Link href="/solutions/by-industry/oil-gas" className="text-sm font-semibold text-emerald-400 hover:underline">
            Oil & Gas →
          </Link>
        </div>
      </section>

    </div>
  );
}
