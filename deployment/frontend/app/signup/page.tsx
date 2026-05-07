'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://rca-backend-5jlv.onrender.com';

const PLANS = [
  { id: 'starter', label: 'Starter', price: '$249', desc: 'Up to 50 assets, community support' },
  { id: 'professional', label: 'Professional', price: '$749', desc: 'Unlimited assets, 24h SLA, full API access', recommended: true },
  { id: 'enterprise', label: 'Enterprise', price: 'Custom', desc: 'On-prem, SSO, 4h SLA, dedicated CSM' },
];

const FEATURES = [
  'LSTM anomaly detection on 13 sensor features',
  'Multi-agent LangGraph RCA pipeline',
  'OWL/SWRL knowledge graph reasoning',
  'REST API access',
  'MongoDB-backed maintenance history',
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'plan' | 'account'>('plan');
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedPlanObj = PLANS.find((p) => p.id === selectedPlan)!;

  function handlePlanNext() {
    if (selectedPlan === 'enterprise') {
      router.push('/company/contact');
      return;
    }
    setStep('account');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name, company, email, password } = form;
    if (!name || !company || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim() || null,
          designation: company.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Registration failed. Please try again.');
        return;
      }
      // Store session
      localStorage.setItem('rca_authenticated', 'true');
      localStorage.setItem('rca_user_email', data.email);
      if (name.trim())    localStorage.setItem('rca_user_name', name.trim());
      if (company.trim()) localStorage.setItem('rca_user_designation', company.trim());
      localStorage.setItem('rca_user_plan', selectedPlan);
      router.replace('/dashboard');
    } catch {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 70%, #022c22 100%)' }}
    >
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">DiagAI</span>
          </Link>
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-emerald-900/40 overflow-hidden">

          {/* Progress bar */}
          <div className="flex border-b border-slate-800">
            {['Choose plan', 'Create account'].map((label, i) => {
              const active = (i === 0 && step === 'plan') || (i === 1 && step === 'account');
              const done = i === 0 && step === 'account';
              return (
                <div key={label} className={`flex-1 py-3 text-center text-xs font-semibold transition-colors ${active ? 'text-emerald-400 border-b-2 border-emerald-500' : done ? 'text-slate-500' : 'text-slate-600'}`}>
                  {done ? '✓ ' : `${i + 1}. `}{label}
                </div>
              );
            })}
          </div>

          <div className="p-8">

            {/* ── Step 1: Plan ── */}
            {step === 'plan' && (
              <>
                <h1 className="text-xl font-bold text-slate-100 mb-1">Start your free trial</h1>
                <p className="text-slate-400 text-sm mb-6">14 days free on any plan. No credit card required.</p>

                <div className="space-y-3 mb-6">
                  {PLANS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedPlan === p.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlan === p.id ? 'border-emerald-500' : 'border-slate-600'}`}>
                            {selectedPlan === p.id && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                          </div>
                          <span className="font-semibold text-slate-200 text-sm">{p.label}</span>
                          {p.recommended && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Popular
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-emerald-400">{p.price}<span className="text-slate-500 font-normal text-xs">{p.id !== 'enterprise' ? '/mo' : ''}</span></span>
                      </div>
                      <p className="text-xs text-slate-500 pl-6">{p.desc}</p>
                    </button>
                  ))}
                </div>

                {selectedPlan !== 'enterprise' && (
                  <div className="mb-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Included in all plans</p>
                    <ul className="space-y-1.5">
                      {FEATURES.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                          <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={handlePlanNext}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold transition-all"
                >
                  {selectedPlan === 'enterprise' ? 'Contact sales →' : 'Continue →'}
                </button>
              </>
            )}

            {/* ── Step 2: Account ── */}
            {step === 'account' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-slate-100">Create your account</h1>
                </div>
                <p className="text-slate-400 text-sm mb-1">
                  Plan: <span className="text-emerald-400 font-medium">{selectedPlanObj.label}</span> — {selectedPlanObj.price}/mo
                  <button onClick={() => setStep('plan')} className="ml-2 text-slate-500 hover:text-slate-300 text-xs underline">Change</button>
                </p>
                <p className="text-slate-500 text-xs mb-6">14-day free trial, no credit card required.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Full name</label>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="Alex Johnson"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Company</label>
                      <input
                        name="company"
                        type="text"
                        required
                        placeholder="Acme Manufacturing"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Work email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold transition-all disabled:opacity-60"
                  >
                    {loading ? 'Creating account…' : 'Start free trial →'}
                  </button>
                </form>

                <p className="text-center text-slate-600 text-xs mt-5">
                  By signing up you agree to our{' '}
                  <Link href="/legal/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/legal/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link>.
                </p>
              </>
            )}

          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 hover:underline font-medium">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
