'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Activity, Zap, TrendingUp, Clock, Calendar, Info, AlertTriangle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ── types ──────────────────────────────────────────────────────────
interface Summary {
  equipment: { total: number; operational: number; warning: number; critical: number; avg_health_score: number }
  alerts: { active: number; critical: number }
  anomalies_last_24h: number
  open_maintenance_tasks: number
}

interface Equipment {
  equipment_id: string
  name: string
  status: string
  health_score: number
}

interface Alert {
  _id?: string
  equipment_id: string
  severity: string
  message: string
  timestamp: string
  top_features?: Array<{ feature_name: string }>
}

interface SensorReading {
  equipment_id: string
  timestamp: string
  air_temperature?: number
  process_temperature?: number
  rotational_speed?: number
  torque?: number
  tool_wear?: number
}

interface MaintenanceTask {
  _id?: string
  description: string
  priority: string
  due_date?: string
}

// ── helpers ────────────────────────────────────────────────────────
function healthColor(v: number) {
  return v >= 70 ? '#22c55e' : v >= 40 ? '#f59e0b' : '#ef4444'
}

function timeAgo(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

const OLD_MSG_RE = /^(CRITICAL|HIGH|MEDIUM|LOW) anomaly detected on .+$/i
const FEATURE_LABELS: Record<string, string> = {
  air_temp: 'Air temperature anomaly detected',
  proc_temp: 'Process temperature anomaly detected',
  rpm: 'Rotational speed anomaly detected',
  torque: 'Torque anomaly detected',
  tool_wear: 'Excessive tool wear detected',
  temp_diff: 'Temperature differential anomaly detected',
  power: 'Power consumption anomaly detected',
  thermal: 'Thermal stress anomaly detected',
}
const SEV_LABELS: Record<string, string> = {
  critical: 'Critical system anomaly detected',
  high: 'High-severity anomaly detected',
  medium: 'Anomaly detected — inspection required',
  low: 'Low-level anomaly detected',
}

function alertTitle(a: Alert) {
  if (!OLD_MSG_RE.test(a.message)) return a.message
  const top = a.top_features?.[0]?.feature_name?.toLowerCase() ?? ''
  for (const [k, v] of Object.entries(FEATURE_LABELS)) {
    if (top.includes(k)) return v
  }
  return SEV_LABELS[a.severity] ?? 'Anomaly detected'
}

const PRIORITY_PILL: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border border-red-500/40',
  high:     'bg-orange-500/20 text-orange-400 border border-orange-500/40',
  medium:   'bg-amber-500/20 text-amber-400 border border-amber-500/40',
  low:      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
}
const SEV_PILL: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border border-red-500/40',
  high:     'bg-orange-500/20 text-orange-400 border border-orange-500/40',
  medium:   'bg-amber-500/20 text-amber-400 border border-amber-500/40',
  low:      'bg-slate-600/30 text-slate-300 border border-slate-600',
}
const ACTIVITY_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high:     'bg-orange-500',
  medium:   'bg-amber-400',
  low:      'bg-blue-400',
}

const SENSOR_FIELDS: Array<{ key: keyof SensorReading; label: string; unit: string }> = [
  { key: 'air_temperature',     label: 'temperature',  unit: '°C' },
  { key: 'process_temperature', label: 'temperature',  unit: '°C' },
  { key: 'rotational_speed',    label: 'speed',        unit: 'RPM' },
  { key: 'torque',              label: 'torque',       unit: 'Nm' },
  { key: 'tool_wear',           label: 'tool wear',    unit: 'min' },
]

// ── component ──────────────────────────────────────────────────────
export default function DashboardOverview() {
  const [summary,   setSummary]   = useState<Summary | null>(null)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [alerts,    setAlerts]    = useState<Alert[]>([])
  const [sensors,   setSensors]   = useState<SensorReading[]>([])
  const [tasks,     setTasks]     = useState<MaintenanceTask[]>([])
  const [loading,   setLoading]   = useState(true)

  async function load() {
    try {
      const [sumRes, eqRes, alertRes, sensorRes, taskRes] = await Promise.all([
        fetch(`${API}/api/dashboard/summary`),
        fetch(`${API}/api/equipment`),
        fetch(`${API}/api/alerts?limit=5`),
        fetch(`${API}/api/sensors/latest?limit=6`),
        fetch(`${API}/api/maintenance/tasks?status=open`),
      ])
      if (sumRes.ok)    setSummary(await sumRes.json())
      if (eqRes.ok)     setEquipment(await eqRes.json())
      if (alertRes.ok)  setAlerts(await alertRes.json())
      if (sensorRes.ok) setSensors(await sensorRes.json())
      if (taskRes.ok)   setTasks(await taskRes.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 30_000)
    return () => clearInterval(t)
  }, [])

  if (loading) return <div className="p-8 text-slate-400">Loading dashboard…</div>

  const avgHealth = summary?.equipment.avg_health_score ?? 0
  const healthCol = avgHealth >= 70 ? 'text-emerald-400' : avgHealth >= 40 ? 'text-amber-400' : 'text-red-400'

  // Build unique sensor tiles (latest per equipment+field combo, max 6)
  const sensorTiles: Array<{ label: string; value: string; unit: string; equipmentId: string }> = []
  for (const r of sensors) {
    for (const f of SENSOR_FIELDS) {
      const raw = r[f.key]
      if (raw == null) continue
      const val = typeof raw === 'number' ? raw.toFixed(1) : String(raw)
      sensorTiles.push({ label: f.label, value: val, unit: f.unit, equipmentId: r.equipment_id })
      if (sensorTiles.length >= 6) break
    }
    if (sensorTiles.length >= 6) break
  }

  // Upcoming tasks sorted by due_date, take first 3
  const upcomingTasks = tasks
    .filter((t) => t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 3)

  return (
    <div className="p-6 space-y-5">

      {/* ── Row 1: System Health + Critical Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* System Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              <div>
                <h2 className="font-bold text-slate-100">System Health</h2>
                <p className="text-xs text-slate-500">Overall system status</p>
              </div>
            </div>
            <span className={`text-3xl font-extrabold ${healthCol}`}>{avgHealth}%</span>
          </div>
          <div className="space-y-3">
            {equipment.slice(0, 6).map((eq) => (
              <div key={eq.equipment_id} className="flex items-center gap-3">
                <span className="w-28 text-sm text-slate-300 truncate">{eq.name || eq.equipment_id}</span>
                <div className="flex-1 bg-slate-700/60 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${eq.health_score}%`, backgroundColor: healthColor(eq.health_score) }}
                  />
                </div>
                <span className="w-10 text-right text-sm text-slate-400">{eq.health_score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className="text-red-400" />
            <h2 className="font-bold text-slate-100">Critical Alerts</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Active system alerts ({summary?.alerts.active ?? 0})</p>
          {alerts.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No active alerts</p>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 4).map((a, i) => (
                <div key={a._id ?? i} className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-4 py-3">
                  {a.severity === 'critical' || a.severity === 'high'
                    ? <AlertTriangle size={15} className="text-amber-400 shrink-0" />
                    : <Info size={15} className="text-blue-400 shrink-0" />
                  }
                  <span className="flex-1 text-sm text-slate-200 truncate">{alertTitle(a)}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${SEV_PILL[a.severity] ?? SEV_PILL.low}`}>
                    {a.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/alerts" className="block text-xs text-blue-400 hover:underline mt-3 text-right">
            View all →
          </Link>
        </div>
      </div>

      {/* ── Row 2: Equipment Status + Maintenance Forecast ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Equipment Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-amber-400" />
            <h2 className="font-bold text-slate-100">Equipment Status</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Equipment overview</p>
          <div className="grid grid-cols-2 gap-3">
            {equipment.slice(0, 4).map((eq) => {
              const isCritical = eq.status === 'critical'
              const isWarning  = eq.status === 'warning'
              return (
                <div
                  key={eq.equipment_id}
                  className={`rounded-xl p-4 border ${
                    isCritical
                      ? 'bg-red-950/40 border-red-800/50'
                      : isWarning
                      ? 'bg-amber-950/30 border-amber-800/40'
                      : 'bg-slate-800/60 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-100">{eq.name || eq.equipment_id}</span>
                    {(isCritical || isWarning) && (
                      <AlertTriangle size={14} className={isCritical ? 'text-red-400' : 'text-amber-400'} />
                    )}
                  </div>
                  <div className="bg-slate-700/60 rounded-full h-1.5 mb-2">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${eq.health_score}%`, backgroundColor: healthColor(eq.health_score) }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{eq.health_score}% health</p>
                </div>
              )
            })}
          </div>
          <Link href="/dashboard/equipment" className="block text-xs text-blue-400 hover:underline mt-3 text-right">
            View all →
          </Link>
        </div>

        {/* Maintenance Forecast */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="text-blue-400" />
            <h2 className="font-bold text-slate-100">Maintenance Forecast</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Predictive maintenance schedule</p>
          {upcomingTasks.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No upcoming tasks</p>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((t, i) => {
                const days = t.due_date ? daysUntil(t.due_date) : null
                return (
                  <div key={t._id ?? i} className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-4 py-3">
                    <Calendar size={15} className="text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{t.description}</p>
                      {days !== null && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {days <= 0 ? 'Overdue' : `In ${days} day${days === 1 ? '' : 's'}`}
                        </p>
                      )}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${PRIORITY_PILL[t.priority] ?? PRIORITY_PILL.low}`}>
                      {t.priority}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          <Link href="/dashboard/maintenance" className="block text-xs text-blue-400 hover:underline mt-3 text-right">
            View schedule →
          </Link>
        </div>
      </div>

      {/* ── Row 3: Sensor Activity + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Sensor Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={18} className="text-emerald-400" />
            <h2 className="font-bold text-slate-100">Sensor Activity</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Live sensor readings</p>
          {sensorTiles.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No sensor data yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {sensorTiles.map((tile, i) => (
                <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">{tile.label}</p>
                  <p className="text-xl font-bold text-slate-100">{tile.value}{tile.unit}</p>
                  <p className="text-xs text-slate-500 mt-1">{tile.equipmentId}</p>
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/sensors" className="block text-xs text-blue-400 hover:underline mt-3 text-right">
            View all sensors →
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={18} className="text-slate-400" />
            <h2 className="font-bold text-slate-100">Recent Activity</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Activity timeline</p>
          {alerts.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No recent activity</p>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 5).map((a, i) => (
                <div key={a._id ?? i} className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">{alertTitle(a)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{timeAgo(a.timestamp)}</p>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${ACTIVITY_DOT[a.severity] ?? 'bg-slate-500'}`} />
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/history" className="block text-xs text-blue-400 hover:underline mt-3 text-right">
            View history →
          </Link>
        </div>
      </div>

    </div>
  )
}
