'use client'

import { useEffect, useState } from 'react'
import { Plus, RefreshCw, Edit2, Check } from 'lucide-react'

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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    operational: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${map[status] || 'bg-slate-700 text-slate-300'}`}>
      {status}
    </span>
  )
}

function HealthBar({ value }: { value: number }) {
  const color = value >= 70 ? 'bg-emerald-500' : value >= 40 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-700 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-10 text-right">{value}%</span>
    </div>
  )
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Equipment</h1>
          <p className="text-slate-400 text-sm mt-1">{equipment.length} machines registered</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {equipment.map((eq) => (
            <div key={eq.equipment_id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-100">{eq.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{eq.equipment_id}</p>
                </div>
                {editId === eq.equipment_id ? (
                  <div className="flex items-center gap-1">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded px-1.5 py-1"
                    >
                      {['operational', 'warning', 'critical'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleStatusUpdate(eq.equipment_id, editStatus)}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={eq.status} />
                    <button
                      onClick={() => { setEditId(eq.equipment_id); setEditStatus(eq.status) }}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p><span className="text-slate-500">Type:</span> {eq.type}</p>
                <p><span className="text-slate-500">Location:</span> {eq.location}</p>
                {eq.last_maintenance && (
                  <p>
                    <span className="text-slate-500">Last maintenance:</span>{' '}
                    {new Date(eq.last_maintenance).toLocaleDateString()}
                  </p>
                )}
                {eq.last_reading_at && (
                  <p>
                    <span className="text-slate-500">Last reading:</span>{' '}
                    {new Date(eq.last_reading_at).toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Health</p>
                <HealthBar value={eq.health_score} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
