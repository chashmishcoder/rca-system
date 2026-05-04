'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Activity, AlertTriangle, CheckCircle, Wrench, TrendingDown } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Summary {
  equipment: { total: number; operational: number; warning: number; critical: number; avg_health_score: number }
  alerts: { active: number; critical: number }
  anomalies_last_24h: number
  open_maintenance_tasks: number
  generated_at: string
}

interface Equipment {
  equipment_id: string
  name: string
  type: string
  location: string
  status: string
  health_score: number
  last_reading_at?: string
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
      <div className="flex-1 bg-slate-700 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-10 text-right">{value}%</span>
    </div>
  )
}

export default function DashboardOverview() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [sumRes, eqRes] = await Promise.all([
          fetch(`${API}/api/dashboard/summary`),
          fetch(`${API}/api/equipment`),
        ])
        if (!sumRes.ok || !eqRes.ok) throw new Error('API error')
        const [sumData, eqData] = await Promise.all([sumRes.json(), eqRes.json()])
        setSummary(sumData)
        setEquipment(eqData)
      } catch (e) {
        setError('Could not load dashboard data. Make sure the backend is running.')
      } finally {
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 30_000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="p-8 text-slate-400">Loading dashboard…</div>
  if (error) return <div className="p-8 text-red-400">{error}</div>

  const stats = [
    {
      label: 'Total Equipment',
      value: summary!.equipment.total,
      icon: Activity,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Active Alerts',
      value: summary!.alerts.active,
      icon: AlertTriangle,
      color: summary!.alerts.critical > 0 ? 'text-red-400' : 'text-amber-400',
      bg: summary!.alerts.critical > 0 ? 'bg-red-500/10' : 'bg-amber-500/10',
    },
    {
      label: 'Anomalies (24 h)',
      value: summary!.anomalies_last_24h,
      icon: TrendingDown,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Open Tasks',
      value: summary!.open_maintenance_tasks,
      icon: Wrench,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">
          System snapshot · updated{' '}
          {summary?.generated_at ? new Date(summary.generated_at).toLocaleTimeString() : '—'}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className={`${bg} rounded-lg p-2.5`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet health */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-100">Fleet Health</h2>
          <span className="text-sm text-slate-400">Avg: {summary!.equipment.avg_health_score}%</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Operational', value: summary!.equipment.operational, color: 'text-emerald-400' },
            { label: 'Warning', value: summary!.equipment.warning, color: 'text-amber-400' },
            { label: 'Critical', value: summary!.equipment.critical, color: 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-100">Equipment Status</h2>
          <Link href="/dashboard/equipment" className="text-xs text-blue-400 hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="pb-2 font-medium">ID</th>
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Location</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {equipment.map((eq) => (
                <tr key={eq.equipment_id} className="hover:bg-slate-800/50">
                  <td className="py-2.5 text-slate-400 font-mono text-xs">{eq.equipment_id}</td>
                  <td className="py-2.5 font-medium text-slate-100">{eq.name}</td>
                  <td className="py-2.5 text-slate-400">{eq.location}</td>
                  <td className="py-2.5">
                    <StatusBadge status={eq.status} />
                  </td>
                  <td className="py-2.5 w-40">
                    <HealthBar value={eq.health_score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
