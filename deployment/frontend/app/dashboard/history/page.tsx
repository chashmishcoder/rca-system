'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AlertRecord {
  equipment_id: string
  timestamp: string
  severity: string
  ensemble_score: number
  message: string
  acknowledged: boolean
}

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
  high:     'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  medium:   'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  low:      'bg-slate-700/40 text-slate-300 border border-slate-600',
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fmtTime(ts: string) {
  return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function HistoryPage() {
  const [alerts, setAlerts] = useState<AlertRecord[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/alerts?limit=200`)
      if (res.ok) setAlerts(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const ackedCount   = alerts.filter((a) => a.acknowledged).length
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length
  const avgScore     = alerts.length > 0
    ? alerts.reduce((s, a) => s + (a.ensemble_score || 0), 0) / alerts.length
    : 0
  const completionRate = alerts.length > 0
    ? Math.round((ackedCount / alerts.length) * 100)
    : 0

  return (
    <div className="p-6 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Clock size={18} className="text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Maintenance History</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1.5 ml-12">View past alert events and maintenance activities</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Record list */}
      {loading ? (
        <div className="text-slate-400 py-20 text-center">Loading history…</div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No maintenance history yet.</div>
      ) : (
        <div className="rounded-2xl border border-slate-800 overflow-hidden mb-6">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`flex items-center gap-6 px-6 py-5 bg-slate-900/50 hover:bg-slate-800/40 transition-colors ${
                i < alerts.length - 1 ? 'border-b border-slate-800' : ''
              }`}
            >
              {/* Status icon */}
              <div className="shrink-0">
                {a.acknowledged
                  ? <CheckCircle2 size={34} className="text-emerald-400" />
                  : <AlertCircle  size={34} className="text-amber-400" />}
              </div>

              {/* Equipment + message */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Equipment</p>
                <p className="font-bold text-slate-100">{a.equipment_id}</p>
                <p className="text-sm text-slate-400 truncate mt-0.5">{a.message}</p>
              </div>

              {/* Date */}
              <div className="shrink-0 hidden md:block">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Date</p>
                <p className="text-sm font-semibold text-slate-200">{fmtDate(a.timestamp)}</p>
                <p className="text-xs text-slate-500">{fmtTime(a.timestamp)}</p>
              </div>

              {/* Score */}
              <div className="shrink-0 hidden lg:block">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Anomaly Score</p>
                <p className="text-sm font-semibold text-slate-200">{a.ensemble_score?.toFixed(3)}</p>
              </div>

              {/* Severity + Status — mirrors "Completed" badge + Cost in template */}
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${SEVERITY_BADGE[a.severity] || SEVERITY_BADGE.low}`}>
                  {a.severity}
                </span>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Status</p>
                <span className={`text-xs font-semibold ${a.acknowledged ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {a.acknowledged ? 'Completed' : 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary bar */}
      {!loading && alerts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks',      value: alerts.length },
            { label: 'Critical Alerts',  value: criticalCount },
            { label: 'Avg Score',        value: avgScore.toFixed(3) },
            { label: 'Completion Rate',  value: `${completionRate}%` },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-sm text-slate-500 mb-2">{s.label}</p>
              <p className="text-2xl font-bold text-slate-100">{s.value}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
