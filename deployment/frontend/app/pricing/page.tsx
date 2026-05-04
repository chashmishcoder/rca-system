'use client';

import { useState } from 'react';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Starter',
    tagline: 'For small teams getting started with predictive maintenance',
    monthlyPrice: 299,
    annualPrice: 249,
    highlight: false,
    cta: 'Start Free Trial',
    ctaHref: '/signup',
    features: [
      { text: 'Up to 10 equipment assets', included: true },
      { text: '3 sensor data streams', included: true },
      { text: 'Anomaly detection (LSTM + RF)', included: true },
      { text: 'Basic RCA reports', included: true },
      { text: 'Email alerts', included: true },
      { text: 'Dashboard access (1 user)', included: true },
      { text: 'REST API access', included: true },
      { text: '30-day data retention', included: true },
      { text: 'Multi-agent RCA pipeline', included: false },
      { text: 'Knowledge graph reasoning', included: false },
      { text: 'Custom SWRL rules', included: false },
      { text: 'Webhook integrations', included: false },
    ],
  },
  {
    name: 'Professional',
    tagline: 'For mid-size operations that need full AI-powered RCA',
    monthlyPrice: 899,
    annualPrice: 749,
    highlight: true,
    badge: 'Most Popular',
    cta: 'Start Free Trial',
    ctaHref: '/signup',
    features: [
      { text: 'Up to 100 equipment assets', included: true },
      { text: 'Unlimited sensor streams', included: true },
      { text: 'Anomaly detection (LSTM + RF)', included: true },
      { text: 'Full multi-agent RCA pipeline', included: true },
      { text: 'Knowledge graph reasoning', included: true },
      { text: 'Slack + email + webhook alerts', included: true },
      { text: 'Dashboard access (10 users)', included: true },
      { text: 'REST API access', included: true },
      { text: '1-year data retention', included: true },
      { text: 'Maintenance task management', included: true },
      { text: 'Custom SWRL rules', included: false },
      { text: 'Dedicated support engineer', included: false },
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'For large fleets and regulated industries with custom requirements',
    monthlyPrice: null,
    annualPrice: null,
    highlight: false,
    cta: 'Contact Sales',
    ctaHref: '/signup',
    features: [
      { text: 'Unlimited equipment assets', included: true },
      { text: 'Unlimited sensor streams', included: true },
      { text: 'Anomaly detection (LSTM + RF)', included: true },
      { text: 'Full multi-agent RCA pipeline', included: true },
      { text: 'Knowledge graph reasoning', included: true },
      { text: 'All alert channels + CMMS push', included: true },
      { text: 'Unlimited users + SSO', included: true },
      { text: 'Full REST API + private deployment', included: true },
      { text: 'Unlimited data retention', included: true },
      { text: 'Maintenance task management', included: true },
      { text: 'Custom SWRL rule authoring', included: true },
      { text: 'Dedicated support engineer', included: true },
    ],
  },
];

const FAQS = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — Starter and Professional plans both include a 14-day free trial with no credit card required. You can import up to 1,000 sensor readings during the trial.',
  },
  {
    q: 'How does asset-based pricing work?',
    a: 'An "asset" is a single piece of equipment (e.g. one CNC machine, one pump). You can add or remove assets at any time. Billing adjusts at the start of the next billing cycle.',
  },
  {
    q: 'Can I change plans mid-cycle?',
    a: 'Yes. Upgrades take effect immediately and are prorated. Downgrades take effect at the end of your current billing period.',
  },
  {
    q: 'What integrations are available?',
    a: 'DiagAI connects to any system that can make HTTP requests. Professional and Enterprise plans include pre-built connectors for Slack, PagerDuty, and common CMMS platforms.',
  },
  {
    q: 'Do you offer on-premises deployment?',
    a: 'Enterprise customers can deploy DiagAI inside their own VPC or on-premises infrastructure. Contact sales for architecture details.',
  },
  {
    q: 'What support is included?',
    a: 'Starter includes community forums and documentation. Professional adds email support with a 24-hour SLA. Enterprise includes a named support engineer and a 4-hour SLA.',
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
            Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            Start with a 14-day free trial. No credit card required. Scale as your fleet grows.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !annual ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Annual
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-gradient-to-b from-emerald-900/30 to-slate-900 border-emerald-600/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">{plan.tagline}</p>
              </div>

              <div className="mb-7">
                {plan.monthlyPrice !== null ? (
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold">
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-500 text-sm mb-1">/month</span>
                  </div>
                ) : (
                  <div className="text-3xl font-extrabold">Custom</div>
                )}
                {plan.monthlyPrice !== null && annual && (
                  <div className="text-xs text-slate-500 mt-1">
                    Billed annually · ${(annual ? plan.annualPrice! : plan.monthlyPrice!) * 12}/yr
                  </div>
                )}
                {plan.monthlyPrice !== null && !annual && (
                  <div className="text-xs text-slate-500 mt-1">Billed monthly</div>
                )}
                {plan.monthlyPrice === null && (
                  <div className="text-xs text-slate-500 mt-1">Volume pricing available</div>
                )}
              </div>

              <Link
                href={plan.ctaHref}
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all mb-7 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    {f.included ? (
                      <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={f.included ? 'text-slate-300' : 'text-slate-600'}>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-10 text-center">Full feature comparison</h2>
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-4 text-slate-400 font-medium">Feature</th>
                  {['Starter', 'Professional', 'Enterprise'].map((p) => (
                    <th key={p} className="px-5 py-4 text-center text-slate-400 font-medium">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  ['Equipment assets', '10', '100', 'Unlimited'],
                  ['Sensor streams', '3', 'Unlimited', 'Unlimited'],
                  ['Anomaly detection', '✓', '✓', '✓'],
                  ['Multi-agent RCA', '—', '✓', '✓'],
                  ['Knowledge graph', '—', '✓', '✓'],
                  ['Custom SWRL rules', '—', '—', '✓'],
                  ['API access', '✓', '✓', '✓ + private deploy'],
                  ['Users', '1', '10', 'Unlimited + SSO'],
                  ['Data retention', '30 days', '1 year', 'Unlimited'],
                  ['Support', 'Community', 'Email (24h)', 'Named engineer (4h)'],
                  ['SLA', '—', '99.9%', '99.95%'],
                ].map(([feature, starter, pro, ent]) => (
                  <tr key={feature} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-slate-300">{feature}</td>
                    <td className="px-5 py-3.5 text-center text-slate-500">{starter}</td>
                    <td className="px-5 py-3.5 text-center text-emerald-400 font-medium">{pro}</td>
                    <td className="px-5 py-3.5 text-center text-slate-300">{ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-10 text-center">Frequently asked questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-semibold text-slate-100 mb-2">{faq.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-700/30 p-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Need a custom deployment?</h2>
            <p className="text-slate-300 text-sm max-w-lg">
              Large fleets, air-gapped environments, custom ontology integration, or regulated industries with specific compliance requirements — our enterprise team will scope a solution for you.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all"
            >
              Contact Sales →
            </Link>
            <Link
              href="/product/api"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700 text-sm"
            >
              View API docs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
