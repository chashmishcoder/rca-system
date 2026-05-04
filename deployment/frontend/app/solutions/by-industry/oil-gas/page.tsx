import Link from 'next/link';

const ASSET_TYPES = ['Centrifugal Pumps', 'Reciprocating Compressors', 'Gas Turbines', 'Pipeline Monitoring', 'Heat Exchangers', 'Separators'];

const WHY = [
  {
    title: 'Safety-critical alerting',
    desc: 'Critical anomalies trigger immediate alerts with severity classification. No event goes unnoticed — even at unmanned remote installations.',
  },
  {
    title: 'Rotating equipment expertise',
    desc: 'The knowledge graph includes causal rules for vibration, thermal, and pressure anomalies specific to pumps and compressors — built from industry failure databases.',
  },
  {
    title: 'Remote monitoring via API',
    desc: 'Push sensor data from SCADA or DCS systems via REST API. No on-premises infrastructure required. DiagAI runs in the cloud and returns results in under 2 seconds.',
  },
  {
    title: 'Regulatory audit trail',
    desc: 'Every anomaly, RCA report, and maintenance action is logged immutably with timestamps — supporting API 670, API 689, and ISO 55000 documentation requirements.',
  },
];

export default function OilGasPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/solutions" className="hover:text-emerald-400 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-slate-400">Oil & Gas</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          By Industry · Oil & Gas
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
          Protecting rotating equipment<br className="hidden md:block" /> in oil & gas
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          A single compressor failure on a gas platform can cost millions and risk lives. DiagAI provides continuous, AI-powered health monitoring for your most critical rotating assets — with an immutable audit trail for regulatory compliance.
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {ASSET_TYPES.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-400">{tag}</span>
          ))}
        </div>
        <Link href="/signup" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all">
          Start Free Trial →
        </Link>
      </section>

      {/* Why */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10">Built for oil & gas demands</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {WHY.map((w) => (
              <div key={w.title} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-emerald-400 mb-2">{w.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sensor signals */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">Monitored sensor signals</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Vibration (axial, radial)',
            'Process temperature',
            'Bearing temperature',
            'Suction / discharge pressure',
            'Flow rate',
            'Rotational speed (RPM)',
            'Torque / shaft power',
            'Lube oil temperature',
            'Motor current draw',
          ].map((s) => (
            <div key={s} className="flex items-center gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-sm text-slate-400">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Nav */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800">
          <Link href="/solutions/by-industry/manufacturing" className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Manufacturing
          </Link>
          <Link href="/solutions/by-industry/utilities" className="text-sm font-semibold text-emerald-400 hover:underline">
            Utilities →
          </Link>
        </div>
      </section>

    </div>
  );
}
