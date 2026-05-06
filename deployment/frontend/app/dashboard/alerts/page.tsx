'use client'

import { useEffect, useState } from 'react'
import { Check, Trash2, RefreshCw, Wrench, Link2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Alert {
  _id?: string
  equipment_id: string
  timestamp: string
  severity: string
  ensemble_score: number
  message: string
  acknowledged: boolean
  task_id?: string            // set when a maintenance task is created from this alert
  resolved_by_task_id?: string // set when the linked task is marked done
  resolved_at?: string
}

const EMPTY_TASK_FORM = { equipment_id: '', description: '', priority: 'medium', due_date: '', notes: '', alert_id: '' }
type TaskForm = typeof EMPTY_TASK_FORM

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/40',
    high:     'bg-orange-500/20 text-orange-400 border-orange-500/40',
    medium:   'bg-amber-500/20 text-amber-400 border-amber-500/40',
    low:      'bg-slate-600/40 text-slate-300 border-slate-600',
    warning:  'bg-amber-500/20 text-amber-400 border-amber-500/40',
    info:     'bg-blue-500/20 text-blue-400 border-blue-500/40',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-xs font-medium lowercase ${map[severity] || map.low}`}>
      {severity}
    </span>
  )
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [unackOnly, setUnackOnly] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [taskModal, setTaskModal] = useState<TaskForm | null>(null)
  const [saving, setSaving] = useState(false)

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

  function openTaskModal(alert: Alert) {
    setTaskModal({
      alert_id: alert._id ?? '',
      equipment_id: alert.equipment_id,
      description: `Fix: ${alert.message.slice(0, 60)}`,
      priority: alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'high' : 'medium',
      due_date: '',
      notes: '',
    })
  }

  async function submitTask(e: React.FormEvent) {
    e.preventDefault()
    if (!taskModal) return
    setSaving(true)
    try {
      await fetch(`${API}/api/maintenance/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskModal),
      })
      setTaskModal(null)
      load()
    } finally {
      setSaving(false)
    }
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
          <p className="text-slate-400">No alerts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const id = alert._id ?? ''
            const isResolved = !!alert.resolved_by_task_id
            const hasTask = !!alert.task_id
            return (
              <div
                key={id || alert.timestamp}
                className={`bg-slate-900 border rounded-xl p-5 flex items-start justify-between gap-4 ${
                  alert.acknowledged ? 'border-slate-800 opacity-60' : 'border-slate-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  {/* Row 1: badge + time + cross-link tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={alert.severity} />
                    <span className="text-xs text-slate-500">
                      {new Date(alert.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    {isResolved && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 text-[11px] font-medium">
                        <Link2 size={10} />
                        Resolved by Task #{alert.resolved_by_task_id?.slice(-6)}
                      </span>
                    )}
                    {hasTask && !isResolved && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/40 border border-blue-700/40 text-blue-400 text-[11px] font-medium">
                        <Wrench size={10} />
                        Task #{alert.task_id?.slice(-6)} open
                      </span>
                    )}
                  </div>

                  {/* Row 2: human-readable message */}
                  <p className="text-base font-semibold text-slate-100 mt-2">{alert.message}</p>

                  {/* Row 3: equipment label */}
                  <p className="text-sm text-slate-400 mt-0.5">Equipment: {alert.equipment_id}</p>

                  {/* Row 4: score + resolved date */}
                  <p className="text-xs text-slate-500 mt-1">Score: {alert.ensemble_score?.toFixed(3)}</p>
                  {isResolved && alert.resolved_at && (
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Resolved {new Date(alert.resolved_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!hasTask && !isResolved && (
                    <button
                      onClick={() => openTaskModal(alert)}
                      disabled={actionId === id}
                      title="Create maintenance task from this alert"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs transition-colors disabled:opacity-50"
                    >
                      <Wrench size={13} />
                      Task
                    </button>
                  )}
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

      {/* Create Task modal */}
      {taskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={submitTask}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 mx-4"
          >
            <h2 className="text-lg font-semibold text-slate-100">Create Maintenance Task</h2>
            <p className="text-xs text-slate-500 -mt-3">Linked to alert <span className="font-mono text-slate-400">#{taskModal.alert_id.slice(-6)}</span></p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Equipment ID</label>
                <input
                  required
                  value={taskModal.equipment_id}
                  onChange={(e) => setTaskModal({ ...taskModal, equipment_id: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Priority</label>
                <select
                  value={taskModal.priority}
                  onChange={(e) => setTaskModal({ ...taskModal, priority: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="critical">Urgent (Critical)</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Task Description</label>
                <input
                  required
                  value={taskModal.description}
                  onChange={(e) => setTaskModal({ ...taskModal, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskModal.due_date}
                  onChange={(e) => setTaskModal({ ...taskModal, due_date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Notes (optional)</label>
                <input
                  value={taskModal.notes}
                  onChange={(e) => setTaskModal({ ...taskModal, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <button
                type="button"
                onClick={() => setTaskModal(null)}
                className="px-5 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
