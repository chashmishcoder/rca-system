import Link from 'next/link';

const LAST_UPDATED = 'May 5, 2026';

const SECTIONS = [
  {
    id: 'information-we-collect',
    title: '1. Information we collect',
    content: [
      {
        heading: 'Account information',
        body: 'When you create a DiagAI account we collect your name, work email address, company name, and the plan you select. This information is required to provide the service.',
      },
      {
        heading: 'Sensor and equipment data',
        body: 'DiagAI processes the industrial sensor telemetry you submit via the API or dashboard — including time-series readings for temperature, vibration, rotational speed, torque, tool wear, and derived feature values. This data is stored in your account namespace in MongoDB Atlas and is used solely to provide anomaly detection, root cause analysis, and predictive maintenance recommendations.',
      },
      {
        heading: 'Usage data',
        body: 'We automatically collect certain information when you use DiagAI: browser type, IP address, pages visited, API endpoint calls (method, path, response status, latency), and dashboard interactions. This data is used for service reliability monitoring and product improvement.',
      },
      {
        heading: 'Communications',
        body: 'If you contact us via email or the contact form, we retain those communications to respond to your enquiry and improve our support quality.',
      },
    ],
  },
  {
    id: 'how-we-use',
    title: '2. How we use your information',
    bullets: [
      'Provide, operate, and maintain the DiagAI platform and REST API',
      'Deliver anomaly detection results, RCA reports, and maintenance recommendations',
      'Authenticate your identity and manage your session',
      'Send transactional emails (account creation, alert notifications, trial expiry)',
      'Respond to support requests and technical enquiries',
      'Monitor service health, debug errors, and improve platform reliability',
      'Comply with legal obligations',
    ],
    note: 'We do not sell your personal data or your equipment data to third parties. We do not use your sensor data to train shared models without your explicit consent.',
  },
  {
    id: 'data-storage',
    title: '3. Data storage and retention',
    content: [
      {
        heading: 'Storage location',
        body: 'Account data and sensor telemetry are stored in MongoDB Atlas (cloud-hosted, AWS us-east-1 region by default). Enterprise customers may request dedicated clusters in alternative regions or on-premises deployments.',
      },
      {
        heading: 'Retention',
        body: 'Active account data is retained for the duration of your subscription plus 30 days after cancellation, during which you may export your data. Anomaly event history and RCA reports are retained for 12 months on the Starter plan and indefinitely on Professional and Enterprise plans. Usage logs are retained for 90 days.',
      },
      {
        heading: 'Deletion',
        body: 'You may request full account and data deletion at any time by emailing hello@diagAI.io. Deletion is completed within 30 days. Anonymised, aggregated statistics derived from your data (e.g., overall platform F1 score metrics) may be retained.',
      },
    ],
  },
  {
    id: 'sharing',
    title: '4. Data sharing and sub-processors',
    body: 'We share data only with sub-processors necessary to operate the service. Our current sub-processors include: MongoDB Atlas (database hosting), Render (compute and static hosting), and Groq (LLM inference for the RCA reasoning pipeline). Each sub-processor is bound by data processing agreements and processes data only as instructed. We do not share your data with any other third parties except as required by law.',
  },
  {
    id: 'security',
    title: '5. Security',
    body: 'DiagAI uses HTTPS for all data in transit. Data at rest in MongoDB Atlas is encrypted using AES-256. API authentication uses bearer tokens scoped to your account. We conduct periodic security reviews. In the event of a data breach affecting your personal data we will notify you within 72 hours of becoming aware of it, consistent with applicable law.',
  },
  {
    id: 'cookies',
    title: '6. Cookies',
    body: 'DiagAI uses session authentication cookies to maintain your logged-in state and localStorage for client-side preferences (e.g., dashboard layout). We do not use tracking cookies or third-party advertising cookies.',
  },
  {
    id: 'your-rights',
    title: '7. Your rights',
    bullets: [
      'Access — request a copy of the personal data we hold about you',
      'Rectification — ask us to correct inaccurate data',
      'Erasure — request deletion of your data (see Section 3)',
      'Portability — receive your data in a structured, machine-readable format',
      'Objection — object to processing based on our legitimate interests',
      'Restriction — ask us to restrict processing in certain circumstances',
    ],
    note: 'To exercise any of these rights, email hello@diagAI.io. We will respond within 30 days.',
  },
  {
    id: 'children',
    title: '8. Children',
    body: 'DiagAI is an industrial B2B platform not directed at individuals under 18. We do not knowingly collect personal data from minors.',
  },
  {
    id: 'changes',
    title: '9. Changes to this policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of material changes by email or via an in-product notification at least 14 days before the change takes effect. Continued use of DiagAI after that date constitutes acceptance of the updated policy.',
  },
  {
    id: 'contact',
    title: '10. Contact',
    body: 'Questions or requests regarding this policy should be directed to: hello@diagAI.io. You can also use the contact form at /company/contact.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Legal
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
        <p className="text-slate-400 text-sm">Last updated: {LAST_UPDATED}</p>
        <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
          This Privacy Policy describes how DiagAI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, stores, and protects information when you use the DiagAI predictive maintenance platform, dashboard, and REST API (&ldquo;Service&rdquo;).
        </p>
      </section>

      {/* ToC + Body */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Sticky table of contents */}
          <aside className="md:col-span-1">
            <div className="sticky top-8 p-5 rounded-xl bg-slate-900 border border-slate-800 text-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contents</p>
              <ol className="space-y-2">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-slate-400 hover:text-emerald-400 transition-colors text-xs leading-relaxed block">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-5 pt-4 border-t border-slate-800">
                <Link href="/legal/terms" className="text-xs text-emerald-400 hover:underline">
                  Terms of Service →
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="md:col-span-3 space-y-10">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-8">
                <h2 className="text-lg font-bold text-slate-100 mb-4 pb-2 border-b border-slate-800">{s.title}</h2>

                {'content' in s && s.content && (
                  <div className="space-y-4">
                    {s.content.map((c) => (
                      <div key={c.heading}>
                        <h3 className="text-sm font-semibold text-emerald-400 mb-1">{c.heading}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{c.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {'body' in s && s.body && (
                  <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
                )}

                {'bullets' in s && s.bullets && (
                  <>
                    <ul className="space-y-2 mb-4">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    {'note' in s && s.note && (
                      <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-sm text-emerald-300">
                        {s.note}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
