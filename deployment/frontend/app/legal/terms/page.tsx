import Link from 'next/link';

const LAST_UPDATED = 'May 5, 2026';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of terms',
    body: 'By creating a DiagAI account, accessing the platform dashboard, or making calls to the DiagAI REST API, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you are accepting these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind that entity. If you do not agree to these Terms, do not use the Service.',
  },
  {
    id: 'service',
    title: '2. Description of service',
    body: 'DiagAI provides an AI-powered predictive maintenance platform that includes: LSTM autoencoder-based anomaly detection, a multi-agent LangGraph root cause analysis pipeline, a semantic OWL/SWRL knowledge graph, a REST API, and a web dashboard. The Service is provided on a subscription basis according to the plan you select at sign-up.',
  },
  {
    id: 'accounts',
    title: '3. Accounts and access',
    content: [
      {
        heading: 'Registration',
        body: 'You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your API keys and login credentials.',
      },
      {
        heading: 'Authorised users',
        body: 'Your account may be used only by you and your authorised employees. Sharing credentials or API keys with parties outside your organisation is prohibited. Enterprise accounts may request multi-seat provisioning.',
      },
      {
        heading: 'Account security',
        body: 'You must notify us immediately at hello@diagAI.io if you suspect unauthorised access to your account. We are not liable for loss or damage arising from your failure to protect your credentials.',
      },
    ],
  },
  {
    id: 'acceptable-use',
    title: '4. Acceptable use',
    intro: 'You may use DiagAI only for lawful purposes and in accordance with these Terms. You must not:',
    bullets: [
      'Attempt to reverse-engineer, decompile, or disassemble any part of the platform or API',
      'Submit sensor data that contains personal data of individuals without appropriate consent',
      'Use the Service to build a competing product or to benchmark against it for commercial resale without our written consent',
      'Probe, scan, or test the vulnerability of the Service or circumvent any security mechanisms',
      'Exceed your plan\'s rate limits or asset limits programmatically or by any other means',
      'Use the API to generate output that is passed off as your own proprietary AI system to third parties',
      'Transmit malware, viruses, or any code designed to interfere with the Service',
    ],
  },
  {
    id: 'subscriptions',
    title: '5. Subscriptions and payment',
    content: [
      {
        heading: 'Plans',
        body: 'DiagAI offers Starter ($249/month), Professional ($749/month), and Enterprise (custom pricing) plans. Plan details including asset limits, API rate limits, and support SLAs are described on the Pricing page and may be updated with 30 days\' notice.',
      },
      {
        heading: 'Billing',
        body: 'Subscriptions are billed monthly or annually in advance. Annual subscribers receive a discount as shown on the Pricing page. Invoices are issued at the start of each billing period.',
      },
      {
        heading: 'Free trial',
        body: 'New accounts receive a 14-day free trial on the selected plan. No payment method is required during the trial. At the end of the trial your account is downgraded to a limited free tier unless you provide payment details.',
      },
      {
        heading: 'Cancellation and refunds',
        body: 'You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. We do not provide pro-rata refunds for unused time on monthly plans. Annual plan subscribers who cancel within the first 30 days are eligible for a full refund.',
      },
    ],
  },
  {
    id: 'data',
    title: '6. Your data',
    content: [
      {
        heading: 'Ownership',
        body: 'You retain full ownership of the sensor data, equipment data, and any other data you submit to DiagAI. We do not claim any intellectual property rights over your data.',
      },
      {
        heading: 'Licence to process',
        body: 'You grant DiagAI a limited, non-exclusive licence to process your data for the sole purpose of providing the Service — including running anomaly detection models, generating RCA reports, and storing results in your account.',
      },
      {
        heading: 'Data export',
        body: 'You may export your anomaly events, RCA reports, and account data at any time via the API or dashboard. Data export is available for 30 days following account cancellation.',
      },
    ],
  },
  {
    id: 'ip',
    title: '7. Intellectual property',
    body: 'DiagAI and its licensors own all rights, title, and interest in and to the Service, including the LSTM models, LangGraph agent architecture, knowledge graph ontology, and dashboard software. These Terms do not grant you any rights to our intellectual property except the limited right to use the Service as described herein. &ldquo;DiagAI&rdquo; and the DiagAI logo are trademarks of DiagAI. You may not use them without our prior written consent.',
  },
  {
    id: 'warranties',
    title: '8. Warranties and disclaimers',
    body: 'THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. DIAGIAI DOES NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE OR UNINTERRUPTED, OR THAT ANOMALY DETECTION AND RCA OUTPUTS WILL BE ACCURATE IN ALL CASES. MAINTENANCE DECISIONS REMAIN THE SOLE RESPONSIBILITY OF THE OPERATOR.',
  },
  {
    id: 'liability',
    title: '9. Limitation of liability',
    body: 'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DIAGIAI\'S TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS PAID BY YOU TO DIAGIAI IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) $100 USD. DIAGIAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.',
  },
  {
    id: 'termination',
    title: '10. Termination',
    body: 'We may suspend or terminate your account immediately if you breach these Terms, fail to pay fees when due, or engage in any use that we reasonably believe poses a security or legal risk. Upon termination, your right to access the Service ceases and we will delete your data in accordance with our Privacy Policy. Provisions of these Terms that by their nature should survive termination will do so, including Sections 6, 7, 8, 9, and 11.',
  },
  {
    id: 'governing-law',
    title: '11. Governing law and disputes',
    body: 'These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any dispute arising under these Terms shall be resolved by binding arbitration in accordance with the JAMS Streamlined Arbitration Rules, except that either party may seek injunctive or other equitable relief in any court of competent jurisdiction. You waive any right to participate in a class action lawsuit or class-wide arbitration.',
  },
  {
    id: 'changes',
    title: '12. Changes to these terms',
    body: 'We may modify these Terms from time to time. We will provide at least 14 days\' notice of material changes via email or in-product notification. Your continued use of the Service after the effective date of the revised Terms constitutes your acceptance. If you do not agree to the revised Terms, you must stop using the Service before the effective date.',
  },
  {
    id: 'contact',
    title: '13. Contact',
    body: 'Questions about these Terms should be directed to hello@diagAI.io or via the contact form at /company/contact.',
  },
];

export default function TermsPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Legal
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Terms of Service</h1>
        <p className="text-slate-400 text-sm">Last updated: {LAST_UPDATED}</p>
        <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
          These Terms of Service govern your use of the DiagAI platform, dashboard, and REST API. Please read them carefully before using the Service.
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
                <Link href="/legal/privacy" className="text-xs text-emerald-400 hover:underline">
                  Privacy Policy →
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
                  <p
                    className="text-sm text-slate-400 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: s.body }}
                  />
                )}

                {'intro' in s && s.intro && (
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">{s.intro}</p>
                )}

                {'bullets' in s && s.bullets && (
                  <ul className="space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
