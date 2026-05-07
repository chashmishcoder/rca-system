'use client'

import { useState, useEffect } from 'react'
import { User, Briefcase, Mail, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://rca-backend-5jlv.onrender.com'

export default function SettingsPage() {
  const [name,        setName]        = useState('')
  const [designation, setDesignation] = useState('')
  const [email,       setEmail]       = useState('')
  const [darkMode,    setDarkMode]    = useState(true)
  const [status,      setStatus]      = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg,    setErrorMsg]    = useState('')

  useEffect(() => {
    const em = localStorage.getItem('rca_user_email') || ''
    setEmail(em)
    setDarkMode(localStorage.getItem('rca_dark_mode') !== 'false')

    // Load from localStorage first (instant), then sync from DB
    setName(localStorage.getItem('rca_user_name') || '')
    setDesignation(localStorage.getItem('rca_user_designation') || '')

    if (em) {
      fetch(`${API}/api/user/profile?email=${encodeURIComponent(em)}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.name)        { setName(data.name);               localStorage.setItem('rca_user_name', data.name) }
          if (data?.designation) { setDesignation(data.designation); localStorage.setItem('rca_user_designation', data.designation) }
        })
        .catch(() => {})
    }
  }, [])

  const handleSave = async () => {
    const trimName  = name.trim()
    const trimDesig = designation.trim()
    if (!trimName && !trimDesig) return

    setStatus('saving')
    setErrorMsg('')
    try {
      const res = await fetch(`${API}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: trimName || null, designation: trimDesig || null }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)

      // Update localStorage cache
      if (trimName)  localStorage.setItem('rca_user_name', trimName)
      if (trimDesig) localStorage.setItem('rca_user_designation', trimDesig)

      window.dispatchEvent(new Event('rca_profile_updated'))
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to save')
      setStatus('error')
    }
  }

  const cardCls  = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  const inputCls = darkMode
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-emerald-500'
    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-emerald-500'
  const labelCls = darkMode ? 'text-slate-400' : 'text-slate-500'
  const textCls  = darkMode ? 'text-slate-100' : 'text-slate-800'
  const subCls   = darkMode ? 'text-slate-500' : 'text-slate-400'

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h2 className={`text-xl font-bold ${textCls}`}>Profile Settings</h2>
        <p className={`text-sm mt-1 ${subCls}`}>Your name and designation are saved to the database and persist across devices</p>
      </div>

      <div className={`border rounded-2xl p-6 space-y-5 ${cardCls}`}>

        {/* Avatar preview */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
            <User size={24} className="text-white" />
          </div>
          <div>
            <p className={`font-semibold ${textCls}`}>{name || 'Your Name'}</p>
            <p className={`text-sm ${subCls}`}>{designation || 'Your Designation'}</p>
            <p className={`text-xs ${subCls}`}>{email}</p>
          </div>
        </div>

        <hr className={darkMode ? 'border-slate-800' : 'border-slate-200'} />

        {/* Name */}
        <div>
          <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1.5 ${labelCls}`}>
            <User size={12} /> Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            maxLength={60}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-colors ${inputCls}`}
          />
        </div>

        {/* Designation */}
        <div>
          <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1.5 ${labelCls}`}>
            <Briefcase size={12} /> Designation / Role
          </label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="e.g. Operations Manager"
            maxLength={80}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-colors ${inputCls}`}
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mb-1.5 ${labelCls}`}>
            <Mail size={12} /> Email (login)
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className={`w-full px-4 py-2.5 rounded-xl border text-sm cursor-not-allowed opacity-60 ${inputCls}`}
          />
          <p className={`text-xs mt-1 ${subCls}`}>Email cannot be changed here.</p>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={status === 'saving' || (!name.trim() && !designation.trim())}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
          >
            {status === 'saving' ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {status === 'saving' ? 'Saving…' : 'Save Changes'}
          </button>
          {status === 'saved' && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
              <CheckCircle size={15} /> Saved to database!
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1.5 text-sm text-red-400">
              <AlertCircle size={15} /> {errorMsg}
            </span>
          )}
        </div>
      </div>

      <p className={`text-xs ${subCls}`}>
        Changes are saved to MongoDB and also cached in your browser. They will be visible on any device you log in from.
      </p>
    </div>
  )
}
