'use client'

import { useState, useEffect } from 'react'
import { User, Briefcase, Mail, Save, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [name,        setName]        = useState('')
  const [designation, setDesignation] = useState('')
  const [email,       setEmail]       = useState('')
  const [darkMode,    setDarkMode]    = useState(true)
  const [saved,       setSaved]       = useState(false)

  useEffect(() => {
    setEmail(localStorage.getItem('rca_user_email') || '')
    setName(localStorage.getItem('rca_user_name') || '')
    setDesignation(localStorage.getItem('rca_user_designation') || '')
    setDarkMode(localStorage.getItem('rca_dark_mode') !== 'false')
  }, [])

  const handleSave = () => {
    const trimmedName = name.trim()
    const trimmedDesignation = designation.trim()
    if (trimmedName) localStorage.setItem('rca_user_name', trimmedName)
    if (trimmedDesignation) localStorage.setItem('rca_user_designation', trimmedDesignation)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    // Reload so the header picks up the new values
    window.dispatchEvent(new Event('rca_profile_updated'))
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
        <p className={`text-sm mt-1 ${subCls}`}>Update your display name and designation shown across the dashboard</p>
      </div>

      {/* Profile card */}
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

        {/* Name field */}
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

        {/* Designation field */}
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

        {/* Save button */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={!name.trim() && !designation.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
          >
            <Save size={15} />
            Save Changes
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
              <CheckCircle size={15} /> Saved!
            </span>
          )}
        </div>
      </div>

      <p className={`text-xs ${subCls}`}>
        Changes are saved locally in your browser and reflected in the top navigation bar immediately after saving.
      </p>
    </div>
  )
}
