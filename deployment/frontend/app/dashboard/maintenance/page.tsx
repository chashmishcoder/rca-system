'use client'

import { useEffect, useState } from 'react'
import { Wrench, Plus, Check, RefreshCw } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Task {
  _id?: string
  equipment_id: string
  status: string
  description: string
  priority: string
  due_date?: string
  created_at?: string
  notes?: string
}

const STATUS_COLOR: Record<string, string> = {
  open: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  done: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

const PRIORITY_COLOR: Record<string, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-amber-400',
  low: 'text-slate-400',
}

interface HistoryRecord {
  equipment_id: string
  task_description: string
  technician: string
  completed_at?: string
  notes?: string
}

const EMPTY_HISTORY = { equipment_id: 'eq-001', task_description: '', technician: '', notes: '' }

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [tab, setTab] = useState<'tasks' | 'history'>('tasks')
  const [loading, setLoading] = useState(true)
  const [showHistoryForm, setShowHistoryForm] = useState(false)
  const [historyForm, setHistoryForm] = useState(EMPTY_HISTORY)
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const [tRes, hRes] = await Promise.all([
        fetch(`${API}/api/maintenance/tasks`),
        fetch(`${API}/api/maintenance/history?limit=50`),
      ])
      if (tRes.ok) setTasks(await tRes.json())
      if (hRes.ok) setHistory(await hRes.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function updateTaskStatus(id: string, status: string) {
    setActionId(id)
    await fetch(`${API}/api/maintenance/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setActionId(null)
    load()
  }

  async function submitHistory(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/maintenance/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyForm),
      })
      if (res.ok) {
        setShowHistoryForm(false)
        setHistoryForm(EMPTY_HISTORY)
        load()
      }
    } finally {
      setSaving(false)
    }
  }

  const openTasks = tasks.filter((t) => t.status !== 'done')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Maintenance</h1>
          <p className="text-slate-400 text-sm mt-1">
            {openTasks.length} open · {doneTasks.length} completed · {history.length} history records
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => setShowHistoryForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm text-white"
          >
            <Plus size={14} />
            Log Maintenance
          </button>
        </div>
      </div>

      {/* Log maintenance form */}
      {showHistoryForm && (
        <form
          onSubmit={submitHistory}
          className="bg-slate-900 border border-blue-500/30 rounded-xl p-5 space-y-4"
        >
          <h2 className="font-semibold text-slate-100">Log Completed Maintenance</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Equipment ID</label>
              <input
                required
                value={historyForm.equipment_id}
                onChange={(e) => setHistoryForm({ ...historyForm, equipment_id: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Technician</label>
              <input
                required
                value={historyForm.technician}
                onChange={(e) => setHistoryForm({ ...historyForm, technician: e.target.value })}
                placeholder="Name or ID"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Task Description</label>
              <textarea
                required
                value={historyForm.task_description}
                onChange={(e) => setHistoryForm({ ...historyForm, task_description: e.target.value })}
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Notes (optional)</label>
              <input
                value={historyForm.notes}
                onChange={(e) => setHistoryForm({ ...historyForm, notes: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setShowHistoryForm(false); setHistoryForm(EMPTY_HISTORY) }}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Log Record'}
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {(['tasks', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t === 'tasks' ? `Tasks (${openTasks.length} open)` : `History (${history.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-400 py-8 text-center">Loading…</div>
      ) : tab === 'tasks' ? (
        tasks.length === 0 ? (
          <div className="text-center py-16">
            <Wrench size={40} className="mx-auto text-slate-700 mb-3" />
            <p className="text-slate-500">No maintenance tasks yet.</p>
            <p className="text-slate-600 text-xs mt-1">Tasks are auto-created when anomalies trigger RCA workflows.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const id = (task as any)._id ?? ''
              return (
                <div
                  key={id || task.created_at}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Wrench size={16} className={`mt-0.5 shrink-0 ${PRIORITY_COLOR[task.priority] || 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded border text-xs font-medium ${STATUS_COLOR[task.status] || ''}`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{task.equipment_id}</span>
                        {task.due_date && (
                          <span className="text-xs text-slate-500">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-200 mt-1">{task.description}</p>
                      {task.notes && <p className="text-xs text-slate-500 mt-0.5">{task.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {task.status === 'open' && (
                      <button
                        onClick={() => updateTaskStatus(id, 'in_progress')}
                        disabled={actionId === id}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs"
                      >
                        Start
                      </button>
                    )}
                    {task.status !== 'done' && (
                      <button
                        onClick={() => updateTaskStatus(id, 'done')}
                        disabled={actionId === id}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs"
                      >
                        <Check size={12} />
                        Done
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      ) : (
        history.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No maintenance history yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="pb-2 font-medium">Equipment</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium">Technician</th>
                  <th className="pb-2 font-medium">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-800/50">
                    <td className="py-2.5 font-mono text-xs text-slate-400">{h.equipment_id}</td>
                    <td className="py-2.5 text-slate-200">{h.task_description}</td>
                    <td className="py-2.5 text-slate-400">{h.technician}</td>
                    <td className="py-2.5 text-slate-400 text-xs">
                      {h.completed_at ? new Date(h.completed_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}
