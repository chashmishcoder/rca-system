'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface RCAResult {
  workflow_id: string
  equipment_id?: string
  status: string
  severity?: string
  ensemble_score?: number
  created_at?: string
  root_cause?: string
}

interface AlertRecord {
  equipment_id: string
  timestamp: string
  severity: string
  ensemble_score: number
  message: string
  acknowledged: boolean
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  low: 'text-slate-300 bg-slate-700/40 border-slate-600',
}

export default function HistoryPage() {
  const [alerts, setAlerts] = useState<AlertRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'alerts' | 'rca'>('alerts')

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

  const ackedAlerts = alerts.filter((a) => a.acknowledged)
  const allAlerts = alerts

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">History</h1>
          <p className="text-slate-400 text-sm mt-1">{allAlerts.length} alert records</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {([
          { key: 'alerts', label: `Alert Log (${allAlerts.length})` },
          { key: 'rca', label: 'RCA History' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === key
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-400 py-8 text-center">Loading…</div>
      ) : tab === 'alerts' ? (
        allAlerts.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No alert history yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="pb-2 font-medium">Time</th>
                  <th className="pb-2 font-medium">Equipment</th>
                  <th className="pb-2 font-medium">Severity</th>
                  <th className="pb-2 font-medium">Score</th>
                  <th className="pb-2 font-medium">Message</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {allAlerts.map((a, i) => (
                  <tr key={i} className={`hover:bg-slate-800/50 ${a.acknowledged ? 'opacity-50' : ''}`}>
                    <td className="py-2.5 text-xs text-slate-500">
                      {new Date(a.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 font-mono text-xs text-slate-300">{a.equipment_id}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded border text-xs font-medium uppercase ${SEVERITY_COLOR[a.severity] || ''}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-300">{a.ensemble_score?.toFixed(3)}</td>
                    <td className="py-2.5 text-slate-300 max-w-xs truncate">{a.message}</td>
                    <td className="py-2.5">
                      <span className={`text-xs ${a.acknowledged ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {a.acknowledged ? 'Acknowledged' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-16 space-y-2">
          <p className="text-slate-400">RCA workflow results are stored in memory on the backend.</p>
          <p className="text-slate-500 text-sm">
            Run an analysis from the{' '}
            <Link href="/analyze" className="text-blue-400 hover:underline">
              Analyze page
            </Link>{' '}
            to see results here.
          </p>
        </div>
      )}
    </div>
  )
}
