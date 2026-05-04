'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
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

const EQUIPMENT_IDS = ['eq-001', 'eq-002', 'eq-003', 'eq-004']

interface Reading {
  equipment_id: string
  timestamp: string
  air_temperature: number
  process_temperature: number
  rotational_speed: number
  torque: number
  tool_wear: number
  ensemble_score: number
  anomaly_detected: boolean
}

const CHART_LINES = [
  { key: 'air_temperature', label: 'Air Temp (K)', color: '#60a5fa' },
  { key: 'process_temperature', label: 'Proc Temp (K)', color: '#f97316' },
  { key: 'rotational_speed', label: 'RPM', color: '#a78bfa', yAxis: 'rpm' },
  { key: 'torque', label: 'Torque (Nm)', color: '#34d399' },
  { key: 'ensemble_score', label: 'Anomaly Score', color: '#f43f5e' },
]

export default function SensorsPage() {
  const [equipmentId, setEquipmentId] = useState(EQUIPMENT_IDS[0])
  const [hours, setHours] = useState(24)
  const [history, setHistory] = useState<Reading[]>([])
  const [latest, setLatest] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLines, setSelectedLines] = useState<Set<string>>(
    new Set(['air_temperature', 'process_temperature', 'ensemble_score'])
  )

  async function load() {
    setLoading(true)
    try {
      const [histRes, latRes] = await Promise.all([
        fetch(`${API}/api/sensors/history?equipment_id=${equipmentId}&hours=${hours}`),
        fetch(`${API}/api/sensors/latest?equipment_id=${equipmentId}&limit=5`),
      ])
      if (histRes.ok) setHistory(await histRes.json())
      if (latRes.ok) setLatest(await latRes.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [equipmentId, hours])

  const chartData = history.map((r) => ({
    ...r,
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))

  function toggleLine(key: string) {
    setSelectedLines((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Sensor Activity</h1>
          <p className="text-slate-400 text-sm mt-1">{history.length} readings in window</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {EQUIPMENT_IDS.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {[1, 6, 12, 24, 48, 168].map((h) => (
              <option key={h} value={h}>{h}h</option>
            ))}
          </select>
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Legend toggles */}
      <div className="flex flex-wrap gap-2">
        {CHART_LINES.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleLine(key)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
              selectedLines.has(key)
                ? 'border-transparent text-slate-100'
                : 'border-slate-700 text-slate-500'
            }`}
            style={selectedLines.has(key) ? { backgroundColor: color + '33', borderColor: color } : {}}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: selectedLines.has(key) ? color : '#475569' }}
            />
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-400">Loading…</div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500">
            No sensor data for this window. Send readings via /api/sensor/ingest to populate.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              {CHART_LINES.filter(({ key }) => selectedLines.has(key)).map(({ key, label, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  dot={false}
                  strokeWidth={1.5}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Latest readings */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="font-semibold text-slate-100 mb-4">Latest Readings</h2>
        {latest.length === 0 ? (
          <p className="text-slate-500 text-sm">No readings yet for {equipmentId}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="pb-2 font-medium">Time</th>
                  <th className="pb-2 font-medium">Air T (K)</th>
                  <th className="pb-2 font-medium">Proc T (K)</th>
                  <th className="pb-2 font-medium">RPM</th>
                  <th className="pb-2 font-medium">Torque</th>
                  <th className="pb-2 font-medium">Wear</th>
                  <th className="pb-2 font-medium">Score</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {latest.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-800/50">
                    <td className="py-2 text-slate-400 text-xs">{new Date(r.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2">{r.air_temperature?.toFixed(1)}</td>
                    <td className="py-2">{r.process_temperature?.toFixed(1)}</td>
                    <td className="py-2">{r.rotational_speed?.toFixed(0)}</td>
                    <td className="py-2">{r.torque?.toFixed(1)}</td>
                    <td className="py-2">{r.tool_wear?.toFixed(0)}</td>
                    <td className="py-2">{r.ensemble_score?.toFixed(3)}</td>
                    <td className="py-2">
                      <span
                        className={`text-xs font-medium ${
                          r.anomaly_detected ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {r.anomaly_detected ? '⚠ Anomaly' : '✓ Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
