'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, TrendingUp, AlertTriangle, Wrench, ArrowLeft } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ── types ──────────────────────────────────────────────────────────
interface Equipment {
  equipment_id: string
  name: string
  type: string
  location: string
  status: string
  health_score: number
  last_reading_at?: string
  installed_at?: string
}

interface SensorReading {
  equipment_id: string
  timestamp: string
  air_temperature?: number
  process_temperature?: number
  rotational_speed?: number
  torque?: number
  tool_wear?: number
  ensemble_score?: number
}

interface Alert {
  _id?: string
  equipment_id: string
  severity: string
  message: string
  top_features?: Array<{ feature_name: string }>
  timestamp: string
}

interface MaintenanceTask {
  _id?: string
  description: string
  priority: string
  status: string
  due_date?: string
  created_at?: string
  estimated_cost?: number
}

interface HealthPoint {
  time: string
  health: number
}

// ── helpers ────────────────────────────────────────────────────────
function healthColor(v: number) {
  return v >= 70 ? '#22c55e' : v >= 40 ? '#f59e0b' : '#ef4444'
}

const STATUS_PILL: Record<string, string> = {
  operational: 'bg-emerald-500 text-white',
  warning: 'bg-amber-500 text-black',
  critical: 'bg-red-500 text-white',
}

const SEV_TEXT: Record<string, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-amber-400',
  low: 'text-slate-400',
}

const OLD_MSG_RE = /^(CRITICAL|HIGH|MEDIUM|LOW) anomaly detected on .+$/i
const FEATURE_LABELS: Record<string, string> = {
  air_temp: 'High Temperature',
  proc_temp: 'Process Temperature Spike',
  rpm: 'Abnormal Rotational Speed',
  torque: 'Torque Anomaly',
  tool_wear: 'Excessive Tool Wear',
  temp_diff: 'Temperature Differential',
  power: 'Power Consumption Anomaly',
  thermal: 'Thermal Stress',
}
const SEV_LABELS: Record<string, string> = {
  critical: 'Critical System Anomaly',
  high: 'High-Severity Anomaly',
  medium: 'Anomaly Detected',
  low: 'Low-Level Anomaly',
}

function alertTitle(a: Alert) {
  if (!OLD_MSG_RE.test(a.message)) return a.message
  const top = a.top_features?.[0]?.feature_name?.toLowerCase() ?? ''
  for (const [k, v] of Object.entries(FEATURE_LABELS)) {
    if (top.includes(k)) return v
  }
  return SEV_LABELS[a.severity] ?? 'Anomaly Detected'
}

function computePowerKW(torque?: number, rpm?: number): string {
  if (!torque || !rpm) return '—'
  return ((torque * rpm) / 9549.3).toFixed(1)
}

// ── main detail component ──────────────────────────────────────────
function EquipmentDetail() {
  const params = useSearchParams()
  const equipmentId = params.get('id') ?? ''

  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [sensor, setSensor] = useState<SensorReading | null>(null)
  const [trend, setTrend] = useState<HealthPoint[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!equipmentId) return
    async function load() {
      try {
        const [eqRes, sensorRes, histRes, alertRes, taskRes] = await Promise.all([
          fetch(`${API}/api/equipment/${equipmentId}`),
          fetch(`${API}/api/sensors/latest?equipment_id=${equipmentId}&limit=1`),
          fetch(`${API}/api/sensors/history?equipment_id=${equipmentId}&hours=24`),
          fetch(`${API}/api/alerts?equipment_id=${equipmentId}&limit=3`),
          fetch(`${API}/api/maintenance/tasks?equipment_id=${equipmentId}&status=done`),
        ])
        if (eqRes.ok) setEquipment(await eqRes.json())
        if (sensorRes.ok) {
          const arr = await sensorRes.json()
          setSensor(arr[0] ?? null)
        }
        if (histRes.ok) {
          const arr: SensorReading[] = await histRes.json()
          const pts: HealthPoint[] = arr.map((r) => ({
            time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            health: r.ensemble_score != null ? Math.round((1 - r.ensemble_score) * 100) : 80,
          }))
          setTrend(pts)
        }
        if (alertRes.ok) setAlerts(await alertRes.json())
        if (taskRes.ok) setTasks(await taskRes.json())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [equipmentId])

  if (!equipmentId) {
    return (
      <div className="p-8 text-slate-400">
        No equipment selected.{' '}
        <Link href="/dashboard/equipment" className="text-blue-400 underline">Go back</Link>
      </div>
    )
  }

  if (loading) return <div className="p-8 text-slate-400">Loading…</div>

  if (!equipment) {
    return (
      <div className="p-8 text-slate-400">
        Equipment <code>{equipmentId}</code> not found.{' '}
        <Link href="/dashboard/equipment" className="text-blue-400 underline">Go back</Link>
      </div>
    )
  }

  const hc = healthColor(equipment.health_score)
  const lastUpdated = equipment.last_reading_at
    ? new Date(equipment.last_reading_at).toLocaleString()
    : '—'

  // Trendline domain — always 0–100 so chart is readable
  const trendMin = Math.max(0, Math.min(...trend.map((p) => p.health)) - 10)

  return (
    <div className="p-6 space-y-6">

      {/* Back link */}
      <Link
        href="/dashboard/equipment"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Equipment
      </Link>

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={28} className="text-slate-200" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{equipment.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Equipment ID: {equipment.equipment_id}</p>
          </div>
        </div>
        <span className={`px-5 py-2 rounded-xl text-sm font-bold ${STATUS_PILL[equipment.status] ?? 'bg-slate-600 text-white'}`}>
          {equipment.status}
        </span>
      </div>

      {/* ── 3 info cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Health Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald-400" />
            <h2 className="font-bold text-slate-100">Health Status</h2>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Current Health</span>
            <span className="text-2xl font-bold text-slate-100">{equipment.health_score}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 mb-5">
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${equipment.health_score}%`, backgroundColor: hc }}
            />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Last Updated</p>
            <p className="text-sm font-medium text-slate-200">{lastUpdated}</p>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            </div>
            <h2 className="font-bold text-slate-100">Operational Metrics</h2>
          </div>
          {sensor ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Temperature</p>
                <p className="text-2xl font-bold text-slate-100">
                  {sensor.air_temperature != null ? `${sensor.air_temperature.toFixed(1)}°C` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Rotational Speed</p>
                <p className="text-2xl font-bold text-slate-100">
                  {sensor.rotational_speed != null ? `${sensor.rotational_speed} RPM` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Power Usage</p>
                <p className="text-2xl font-bold text-slate-100">
                  {computePowerKW(sensor.torque, sensor.rotational_speed)} kW
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No sensor data yet</p>
          )}
        </div>

        {/* Recent Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-red-400" />
            <h2 className="font-bold text-slate-100">Recent Alerts</h2>
          </div>
          {alerts.length === 0 ? (
            <p className="text-slate-500 text-sm">No recent alerts</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((a, i) => (
                <div
                  key={a._id ?? i}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                    a.severity === 'critical'
                      ? 'bg-red-950/40 border-red-800/50'
                      : a.severity === 'high'
                      ? 'bg-orange-950/30 border-orange-800/40'
                      : 'bg-slate-800/60 border-slate-700/40'
                  }`}
                >
                  <span className="text-sm text-slate-200 truncate flex-1 mr-3">{alertTitle(a)}</span>
                  <span className={`text-xs font-semibold capitalize shrink-0 ${SEV_TEXT[a.severity] ?? 'text-slate-400'}`}>
                    {a.severity.charAt(0).toUpperCase() + a.severity.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Health Trend ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <polyline points="2,10 6,6 10,12 14,4 16,7" stroke="#22d3ee" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="font-bold text-slate-100">Health Trend</h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">Equipment health over the last 24 hours</p>

        {trend.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">No history data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="4 4" vertical={true} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[trendMin, 100]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickCount={5}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Legend
                iconType="plainline"
                wrapperStyle={{ color: '#22d3ee', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="health"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Maintenance History ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Wrench size={18} className="text-slate-400" />
          <h2 className="font-bold text-slate-100">Maintenance History</h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">Past maintenance actions and records</p>

        {tasks.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No completed maintenance records</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((t, i) => {
              const date = t.due_date
                ? new Date(t.due_date).toLocaleDateString('en-CA')
                : t.created_at
                ? new Date(t.created_at).toLocaleDateString('en-CA')
                : '—'
              return (
                <div
                  key={t._id ?? i}
                  className="flex items-center justify-between bg-slate-800/60 rounded-xl px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{t.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{date}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shrink-0 ml-4">
                    Completed
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}

// Wrap in Suspense because useSearchParams() requires it
export default function EquipmentDetailsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading…</div>}>
      <EquipmentDetail />
    </Suspense>
  )
}
