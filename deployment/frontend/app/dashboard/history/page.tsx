'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AlertRecord {
  equipment_id: string
  timestamp: string
  severity: string
  ensemble_score: number
  cost?: number
  message: string
  acknowledged: boolean
}

interface EquipmentDoc {
  equipment_id: string
  name: string
}

const TASK_TYPE: Record<string, string> = {
  critical: 'Emergency Repair',
  high:     'Urgent Maintenance',
  medium:   'Preventive Maintenance',
  low:      'Routine Inspection',
}

const DURATION_MIN: Record<string, number> = {
  critical: 180,
  high:     270,
  medium:   135,
  low:      45,
}

const TECHNICIANS = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emma Wilson', 'Chris Lee']

function getTechnician(idx: number) {
  return TECHNICIANS[idx % TECHNICIANS.length]
}

function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fmtTime(ts: string) {
  return new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function HistoryPage() {
  const [alerts, setAlerts]             = useState<AlertRecord[]>([])
  const [equipmentMap, setEquipmentMap] = useState<Record<string, string>>({})
  const [costConfig, setCostConfig]     = useState<Record<string, number>>({
    critical: 890, high: 650, medium: 320, low: 180,
  })
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const [alertRes, eqRes, costRes] = await Promise.all([
        fetch(`${API}/api/alerts?limit=200`),
        fetch(`${API}/api/equipment`),
        fetch(`${API}/api/maintenance/cost-config`),
      ])
      if (alertRes.ok) setAlerts(await alertRes.json())
      if (eqRes.ok) {
        const eqList: EquipmentDoc[] = await eqRes.json()
        const map: Record<string, string> = {}
        eqList.forEach((e) => { map[e.equipment_id] = e.name })
        setEquipmentMap(map)
      }
      if (costRes.ok) {
        const cfg = await costRes.json()
        if (cfg?.costs) setCostConfig(cfg.costs)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  /** Cost for a single alert: use per-alert value stored in DB, fallback to live config */
  const getCost = (a: AlertRecord) => a.cost ?? costConfig[a.severity] ?? 320

  const ackedCount     = alerts.filter((a) => a.acknowledged).length
  const totalCost      = alerts.reduce((s, a) => s + getCost(a), 0)
  const totalMins      = alerts.reduce((s, a) => s + (DURATION_MIN[a.severity] ?? 135), 0)
  const avgMins        = alerts.length > 0 ? Math.round(totalMins / alerts.length) : 0
  const completionRate = alerts.length > 0 ? Math.round((ackedCount / alerts.length) * 100) : 0

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

          {/* Column header row */}
          <div className="flex items-center px-6 py-3 bg-slate-800/60 border-b border-slate-700">
            <div className="w-[42px] shrink-0" />
            <div className="flex-1 min-w-0 pl-4">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Equipment</span>
            </div>
            <div className="w-[152px] shrink-0 hidden md:block">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Date</span>
            </div>
            <div className="w-[160px] shrink-0 hidden lg:block">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Technician</span>
            </div>
            <div className="w-[88px] shrink-0 text-right">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Status</span>
            </div>
            <div className="w-[88px] shrink-0 text-right">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Cost</span>
            </div>
          </div>

          {alerts.map((a, i) => (
            <div
              key={i}
              className={`flex items-center px-6 py-5 bg-slate-900/50 hover:bg-slate-800/40 transition-colors ${
                i < alerts.length - 1 ? 'border-b border-slate-800' : ''
              }`}
            >
              {/* Status icon — 42px */}
              <div className="w-[42px] shrink-0">
                {a.acknowledged
                  ? <CheckCircle2 size={32} className="text-emerald-400" />
                  : <AlertCircle  size={32} className="text-amber-400" />}
              </div>

              {/* Equipment + task type — flex-1 */}
              <div className="flex-1 min-w-0 pl-4">
                <p className="font-bold text-slate-100 truncate">
                  {equipmentMap[a.equipment_id]
                    ? <>{equipmentMap[a.equipment_id]} <span className="font-normal text-slate-500 text-xs">({a.equipment_id})</span></>
                    : a.equipment_id}
                </p>
                <p className="text-sm text-slate-400 mt-0.5">{TASK_TYPE[a.severity] ?? 'Inspection'}</p>
              </div>

              {/* Date — 152px */}
              <div className="w-[152px] shrink-0 hidden md:block">
                <p className="text-sm font-semibold text-slate-200">{fmtDate(a.timestamp)}</p>
                <p className="text-xs text-slate-500">{fmtTime(a.timestamp)}</p>
              </div>

              {/* Technician — 160px */}
              <div className="w-[160px] shrink-0 hidden lg:block">
                <p className="text-sm font-semibold text-slate-200">{getTechnician(i)}</p>
              </div>

              {/* Status — 88px */}
              <div className="w-[88px] shrink-0 text-right">
                <span className={`text-xs font-semibold ${a.acknowledged ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {a.acknowledged ? 'Completed' : 'Active'}
                </span>
              </div>

              {/* Cost — 88px */}
              <div className="w-[88px] shrink-0 text-right">
                <p className="text-sm font-bold text-slate-200">${getCost(a).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary bar */}
      {!loading && alerts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks',     value: alerts.length },
            { label: 'Total Cost',      value: `$${totalCost.toLocaleString()}` },
            { label: 'Avg Duration',    value: fmtDuration(avgMins) },
            { label: 'Completion Rate', value: `${completionRate}%` },
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
