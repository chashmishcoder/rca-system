'use client';

import { useState } from 'react';
import Link from 'next/link';

const TOPICS = [
  'Sales & Pricing',
  'Enterprise Deployment',
  'Technical Support',
  'API & Integration',
  'Partnership',
  'Press & Media',
  'Careers',
  'Other',
];

const CONTACT_CHANNELS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'Email',
    value: 'hello@diagAI.io',
    sub: 'We reply within 24 hours on business days',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    label: 'GitHub',
    value: 'github.com/chashmishcoder',
    sub: 'Open issues, explore the codebase',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    label: 'Enterprise Sales',
    value: 'Book a 30-min call',
    sub: 'Custom pricing, on-prem, compliance',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState('Sales & Pricing');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/company" className="hover:text-emerald-400 transition-colors">Company</Link>
          <span>/</span>
          <span className="text-slate-400">Contact</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
          Contact
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Get in touch</h1>
        <p className="text-lg text-slate-400 max-w-xl">
          Questions about pricing, enterprise deployments, the API, or anything else — we read and reply to every message.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-5 gap-10">

          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 rounded-2xl bg-slate-900 border border-emerald-700/40">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Message sent</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-emerald-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">First name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Alex"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Last name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Johnson"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Work email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="alex@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Company</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Acme Manufacturing"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Tell us about your use case, fleet size, or question…"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all"
                >
                  Send message →
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-2 space-y-5">
            {CONTACT_CHANNELS.map((c) => (
              <div key={c.label} className="flex gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  {c.icon}
                </div>
                <div>
                  <div className="font-semibold text-slate-200 text-sm mb-0.5">{c.label}</div>
                  <div className="text-sm text-emerald-400">{c.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.sub}</div>
                </div>
              </div>
            ))}

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Response times</div>
              <div className="space-y-2">
                {[
                  { plan: 'Starter', time: 'Community (forums)' },
                  { plan: 'Professional', time: '24-hour SLA' },
                  { plan: 'Enterprise', time: '4-hour SLA' },
                ].map((r) => (
                  <div key={r.plan} className="flex justify-between text-sm">
                    <span className="text-slate-400">{r.plan}</span>
                    <span className="text-slate-500">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
