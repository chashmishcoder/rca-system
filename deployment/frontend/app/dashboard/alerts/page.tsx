'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Check, Trash2, RefreshCw } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Alert {
  _id?: string
  equipment_id: string
  timestamp: string
  severity: string
  ensemble_score: number
  message: string
  acknowledged: boolean
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/40',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    low: 'bg-slate-600/40 text-slate-300 border-slate-600',
  }
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium uppercase ${map[severity] || map.low}`}>
      {severity}
    </span>
  )
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [unackOnly, setUnackOnly] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/alerts?limit=100${unackOnly ? '&unacknowledged_only=true' : ''}`)
      if (res.ok) setAlerts(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [unackOnly])

  async function acknowledge(id: string) {
    setActionId(id)
    await fetch(`${API}/api/alerts/${id}/acknowledge`, { method: 'PATCH' })
    setActionId(null)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this alert?')) return
    setActionId(id)
    await fetch(`${API}/api/alerts/${id}`, { method: 'DELETE' })
    setActionId(null)
    load()
  }

  const active = alerts.filter((a) => !a.acknowledged).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Alerts</h1>
          <p className="text-slate-400 text-sm mt-1">{active} unacknowledged</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded"
              checked={unackOnly}
              onChange={(e) => setUnackOnly(e.target.checked)}
            />
            Unacknowledged only
          </label>
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400 py-12 text-center">Loading alerts…</div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16">
          <AlertTriangle size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">No alerts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const id = (alert as any)._id ?? ''
            return (
              <div
                key={id || alert.timestamp}
                className={`bg-slate-900 border rounded-xl p-4 flex items-start justify-between gap-4 ${
                  alert.acknowledged ? 'border-slate-800 opacity-60' : 'border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <AlertTriangle
                    size={18}
                    className={
                      alert.severity === 'critical'
                        ? 'text-red-400 mt-0.5 shrink-0'
                        : alert.severity === 'high'
                        ? 'text-orange-400 mt-0.5 shrink-0'
                        : 'text-amber-400 mt-0.5 shrink-0'
                    }
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SeverityBadge severity={alert.severity} />
                      <span className="text-xs text-slate-500 font-mono">{alert.equipment_id}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 mt-1">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Score: {alert.ensemble_score?.toFixed(3)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledge(id)}
                      disabled={actionId === id}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs transition-colors disabled:opacity-50"
                    >
                      <Check size={13} />
                      Ack
                    </button>
                  )}
                  <button
                    onClick={() => remove(id)}
                    disabled={actionId === id}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
