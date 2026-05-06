'use client'

import { useEffect, useState } from 'react'
import { Plus, RefreshCw, Zap, Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Equipment {
  equipment_id: string
  name: string
  type: string
  location: string
  status: string
  health_score: number
  last_maintenance?: string | null
  last_reading_at?: string
  installed_at?: string
}

const STATUS_PILL: Record<string, string> = {
  operational: 'bg-emerald-500 text-white',
  warning:     'bg-amber-500 text-black',
  critical:    'bg-red-500 text-white',
}

function healthColor(v: number) {
  return v >= 70 ? '#22c55e' : v >= 40 ? '#f59e0b' : '#ef4444'
}

const EMPTY_FORM = { equipment_id: '', name: '', type: 'pump', location: '' }

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/equipment`)
      if (res.ok) setEquipment(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowForm(false)
        setForm(EMPTY_FORM)
        load()
      } else {
        const err = await res.json()
        alert(err.detail || 'Failed to create equipment')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusUpdate(equipment_id: string, status: string) {
    await fetch(`${API}/api/equipment/${equipment_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setEditId(null)
    load()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Equipment Status</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor and manage all equipment</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm text-white transition-colors"
          >
            <Plus size={14} />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-slate-900 border border-blue-500/30 rounded-xl p-5 space-y-4"
        >
          <h2 className="font-semibold text-slate-100">Register New Equipment</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'equipment_id', label: 'ID (e.g. eq-005)', placeholder: 'eq-005' },
              { key: 'name', label: 'Name', placeholder: 'Pump E' },
              { key: 'location', label: 'Location', placeholder: 'Zone 2 – Cooling' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-slate-400 mb-1">{label}</label>
                <input
                  required
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              >
                {['pump', 'motor', 'compressor', 'filter', 'conveyor', 'other'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Register'}
            </button>
          </div>
        </form>
      )}

      {/* Equipment grid */}
      {loading ? (
        <div className="text-slate-400 py-8 text-center">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {equipment.map((eq) => {
            const isEditing = editId === eq.equipment_id
            const lastTime = eq.last_reading_at
              ? new Date(eq.last_reading_at).toLocaleTimeString()
              : '—'
            const hc = healthColor(eq.health_score)

            return (
              <div
                key={eq.equipment_id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4"
              >
                {/* Card header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={20} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="font-bold text-lg text-slate-100 leading-tight">{eq.name}</p>
                      <p className="text-sm text-slate-500">ID: {eq.equipment_id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${STATUS_PILL[eq.status] ?? 'bg-slate-600 text-white'}`}>
                    {eq.status}
                  </span>
                </div>

                {/* Health */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-300">Health Status</span>
                    <span className="text-sm font-bold text-slate-100">{eq.health_score}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{ width: `${eq.health_score}%`, backgroundColor: hc }}
                    />
                  </div>
                </div>

                {/* Last updated */}
                <p className="text-sm text-slate-500">Last updated: {lastTime}</p>

                {/* Buttons / edit row */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg px-3 py-2"
                    >
                      {['operational', 'warning', 'critical'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleStatusUpdate(eq.equipment_id, editStatus)}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
                    >
                      <Check size={14} /> Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`/dashboard/alerts?equipment=${eq.equipment_id}`}
                      className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
                    >
                      View Details
                    </a>
                    <button
                      onClick={() => { setEditId(eq.equipment_id); setEditStatus(eq.status) }}
                      className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
