'use client'

import { useEffect, useState } from 'react'
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
interface Reading {
  equipment_id: string
  timestamp: string
  air_temperature?: number
  process_temperature?: number
  rotational_speed?: number
  torque?: number
  tool_wear?: number
  ensemble_score?: number
}

// ── sensor tile definitions ────────────────────────────────────────
// Each tile picks one field from the reading. Max range used for the bar.
const TILE_DEFS: Array<{
  key: keyof Reading
  label: string
  unit: string
  max: number
  fmt?: (v: number) => string
}> = [
  { key: 'air_temperature',     label: 'temperature',      unit: '°C',  max: 400 },
  { key: 'process_temperature', label: 'temperature',      unit: '°C',  max: 400 },
  { key: 'rotational_speed',    label: 'rotational speed', unit: 'RPM', max: 3000 },
  { key: 'torque',              label: 'torque',           unit: 'Nm',  max: 80 },
  { key: 'tool_wear',           label: 'tool wear',        unit: 'min', max: 250 },
]

// Chart lines — map our actual fields to the 3-line overlay
const CHART_LINES = [
  { key: 'air_temperature',  label: 'Temp (°C)',      color: '#ef4444' },
  { key: 'torque',           label: 'Torque (Nm)',    color: '#f59e0b' },
  { key: 'tool_wear',        label: 'Tool Wear (min)', color: '#3b82f6' },
]

// ── component ──────────────────────────────────────────────────────
export default function SensorsPage() {
  const [latest,    setLatest]    = useState<Reading[]>([])
  const [history,   setHistory]   = useState<Reading[]>([])
  const [eqList,    setEqList]    = useState<string[]>([])
  const [loading,   setLoading]   = useState(true)
  const [histEqId,  setHistEqId]  = useState('')

  // Fetch all registered equipment on mount so selector is always fully populated
  useEffect(() => {
    fetch(`${API}/api/equipment`)
      .then((r) => r.ok ? r.json() : [])
      .then((data: Array<{ equipment_id: string }>) => {
        const ids = data.map((e) => e.equipment_id).sort()
        setEqList(ids)
        if (ids.length > 0 && histEqId === '') setHistEqId(ids[0])
      })
  }, [])

  async function load() {
    if (!histEqId) return
    try {
      // Fetch last reading per equipment (limit=100 ensures all machines covered)
      const latRes  = await fetch(`${API}/api/sensors/latest?limit=100`)
      // Fetch 24h history for the selected equipment for the trend chart
      const histRes = await fetch(`${API}/api/sensors/history?equipment_id=${histEqId}&hours=24`)
      if (latRes.ok)  setLatest(await latRes.json())
      if (histRes.ok) setHistory(await histRes.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!histEqId) return
    load()
    const t = setInterval(load, 30_000)
    return () => clearInterval(t)
  }, [histEqId])

  // Build tiles: one tile per (equipment × sensor type), up to 6
  const tiles: Array<{ label: string; value: string; unit: string; equipmentId: string; pct: number }> = []
  for (const r of latest) {
    for (const def of TILE_DEFS) {
      const raw = r[def.key]
      if (raw == null || typeof raw !== 'number') continue
      tiles.push({
        label:       def.label,
        value:       raw.toFixed(1),
        unit:        def.unit,
        equipmentId: r.equipment_id,
        pct:         Math.min(100, Math.round((raw / def.max) * 100)),
      })
      if (tiles.length >= 6) break
    }
    if (tiles.length >= 6) break
  }

  // Chart data
  const chartData = history.map((r) => ({
    time:            new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    air_temperature: r.air_temperature,
    torque:          r.torque,
    tool_wear:       r.tool_wear,
  }))

  // Merge registered equipment + any IDs seen in sensor readings (handles edge cases)
  const eqIds = Array.from(new Set([...eqList, ...latest.map((r) => r.equipment_id)])).sort()

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polyline points="2,13 6,7 10,15 14,5 18,9 20,7"
              stroke="#22d3ee" strokeWidth="2.2" fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="text-3xl font-bold text-slate-100">Sensor Activity</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1 ml-8">Real-time sensor readings and trends</p>
      </div>

      {/* ── Sensor tiles ── */}
      {loading ? (
        <div className="text-slate-400 py-6 text-center">Loading…</div>
      ) : tiles.length === 0 ? (
        <p className="text-slate-500 text-sm">No sensor readings yet. Ingest data via /api/sensor/ingest.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tiles.map((tile, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >
              {/* label + icon */}
              <div className="flex items-center gap-1.5 mb-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <polyline points="1,9 4,5 7,10 10,3 13,6"
                    stroke="#22d3ee" strokeWidth="1.8" fill="none"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-slate-300">{tile.label}</span>
              </div>
              {/* equipment ID */}
              <p className="text-xs text-slate-500 mb-3">{tile.equipmentId}</p>
              {/* value */}
              <p className="text-3xl font-bold text-slate-100 mb-4">
                {tile.value}{tile.unit}
              </p>
              {/* progress bar */}
              <div className="w-full bg-slate-700/60 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-cyan-400 transition-all"
                  style={{ width: `${tile.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Sensor Trends (24h) ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polyline points="1,11 5,6 8,12 11,4 15,8"
                stroke="#22d3ee" strokeWidth="2" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="font-bold text-slate-100">Sensor Trends (24h)</h2>
          </div>
          {/* Equipment selector */}
          {eqIds.length > 0 && (
            <select
              value={histEqId}
              onChange={(e) => setHistEqId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {eqIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-5 ml-6">Multi-sensor overlay showing trends over the last 24 hours</p>

        {chartData.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-10">No history data for {histEqId}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Legend
                iconType="plainline"
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
              />
              {CHART_LINES.map(({ key, label, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: color, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  )
}

