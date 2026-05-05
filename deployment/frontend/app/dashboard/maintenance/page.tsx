'use client'

import { useEffect, useState } from 'react'
import { Wrench, Plus, Check, RefreshCw, Clock, Calendar, AlertCircle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Task {
  _id?: string
  equipment_id: string
  status: string
  description: string
  priority: string
  due_date?: string
  created_at?: string
  estimated_cost?: number
  notes?: string
}

interface HistoryRecord {
  equipment_id: string
  task_description: string
  technician: string
  completed_at?: string
  notes?: string
}

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'bg-red-500 text-white',
  high:     'bg-orange-500 text-white',
  medium:   'bg-amber-500 text-white',
  low:      'bg-emerald-600 text-white',
}

const PRIORITY_LABEL: Record<string, string> = {
  critical: 'Urgent',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
}

const EMPTY_HISTORY = { equipment_id: 'eq-001', task_description: '', technician: '', notes: '' }

function daysUntil(dateStr: string): number {
  const now = new Date()
  const due = new Date(dateStr)
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function fmtDueLabel(dateStr: string): { label: string; urgent: boolean } {
  const days = daysUntil(dateStr)
  if (days < 0)  return { label: `Overdue by ${Math.abs(days)}d`, urgent: true }
  if (days === 0) return { label: 'Due today', urgent: true }
  if (days <= 2)  return { label: `Due in ${days} day${days === 1 ? '' : 's'}`, urgent: true }
  return {
    label: new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    urgent: false,
  }
}

export default function MaintenancePage() {
  const [tasks, setTasks]         = useState<Task[]>([])
  const [history, setHistory]     = useState<HistoryRecord[]>([])
  const [costConfig, setCostConfig] = useState<Record<string, number>>({
    critical: 890, high: 650, medium: 320, low: 180,
  })
  const [tab, setTab]             = useState<'tasks' | 'history'>('tasks')
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [historyForm, setHistoryForm] = useState(EMPTY_HISTORY)
  const [saving, setSaving]       = useState(false)
  const [actionId, setActionId]   = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const [tRes, hRes, cRes] = await Promise.all([
        fetch(`${API}/api/maintenance/tasks`),
        fetch(`${API}/api/maintenance/history?limit=50`),
        fetch(`${API}/api/maintenance/cost-config`),
      ])
      if (tRes.ok) setTasks(await tRes.json())
      if (hRes.ok) setHistory(await hRes.json())
      if (cRes.ok) {
        const cfg = await cRes.json()
        if (cfg?.costs) setCostConfig(cfg.costs)
      }
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
        setShowForm(false)
        setHistoryForm(EMPTY_HISTORY)
        load()
      }
    } finally {
      setSaving(false)
    }
  }

  const getTaskCost = (t: Task) => t.estimated_cost ?? costConfig[t.priority] ?? 320

  const openTasks   = tasks.filter((t) => t.status !== 'done')
  const doneTasks   = tasks.filter((t) => t.status === 'done')

  // Urgency groups (only open tasks)
  const urgentTasks   = openTasks.filter((t) => t.due_date && daysUntil(t.due_date) <= 2)
  const upcomingTasks = openTasks.filter((t) => !t.due_date || (daysUntil(t.due_date) > 2 && daysUntil(t.due_date) <= 14))
  const laterTasks    = openTasks.filter((t) => t.due_date && daysUntil(t.due_date) > 14)

  function TaskCard({ task }: { task: Task }) {
    const id = task._id ?? ''
    const { label, urgent } = task.due_date ? fmtDueLabel(task.due_date) : { label: 'No due date', urgent: false }
    const cost = getTaskCost(task)

    return (
      <div className={`relative rounded-xl p-5 border ${
        urgent
          ? 'bg-red-950/40 border-red-800/50'
          : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Priority badge */}
        <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded text-[11px] font-bold ${PRIORITY_BADGE[task.priority] ?? PRIORITY_BADGE.low}`}>
          {PRIORITY_LABEL[task.priority] ?? task.priority}
        </span>

        {/* Title */}
        <div className="flex items-start gap-2 pr-16">
          <Wrench size={15} className="mt-0.5 text-slate-400 shrink-0" />
          <p className="font-semibold text-slate-100 text-sm leading-snug">{task.description}</p>
        </div>

        {/* Equipment ID */}
        <p className="text-xs text-slate-500 font-mono mt-1.5 ml-5">{task.equipment_id}</p>

        {/* Due date */}
        <div className="flex items-center gap-1.5 mt-3 ml-5">
          {urgent
            ? <Clock size={13} className="text-red-400 shrink-0" />
            : <Calendar size={13} className="text-slate-500 shrink-0" />}
          <span className={`text-xs font-medium ${urgent ? 'text-red-400' : 'text-slate-400'}`}>{label}</span>
        </div>

        {/* Cost */}
        <div className="mt-3 ml-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Estimated Cost</p>
          <p className="text-sm font-bold text-slate-200 mt-0.5">${cost.toLocaleString()}</p>
        </div>

        {/* Actions */}
        {task.status !== 'done' && (
          <div className="flex gap-2 mt-4 ml-5">
            {task.status === 'open' && (
              <button
                onClick={() => updateTaskStatus(id, 'in_progress')}
                disabled={actionId === id}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs disabled:opacity-50"
              >
                Start
              </button>
            )}
            <button
              onClick={() => updateTaskStatus(id, 'done')}
              disabled={actionId === id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs disabled:opacity-50"
            >
              <Check size={11} />
              Mark Done
            </button>
          </div>
        )}
      </div>
    )
  }

  function SectionGroup({ title, icon, tasks }: { title: string; icon: React.ReactNode; tasks: Task[] }) {
    if (tasks.length === 0) return null
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h2 className="text-sm font-semibold text-slate-300">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((t) => <TaskCard key={t._id ?? t.created_at} task={t} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Wrench size={17} className="text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Maintenance Schedule</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1.5 ml-12">Manage and track maintenance tasks</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm text-slate-300"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm text-white font-medium"
          >
            <Plus size={14} />
            Log Maintenance
          </button>
        </div>
      </div>

      {/* Log maintenance form */}
      {showForm && (
        <form
          onSubmit={submitHistory}
          className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 space-y-4"
        >
          <h2 className="font-semibold text-slate-100">Log Completed Maintenance</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Equipment ID</label>
              <input
                required
                value={historyForm.equipment_id}
                onChange={(e) => setHistoryForm({ ...historyForm, equipment_id: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Technician</label>
              <input
                required
                value={historyForm.technician}
                onChange={(e) => setHistoryForm({ ...historyForm, technician: e.target.value })}
                placeholder="Name or ID"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Task Description</label>
              <textarea
                required
                value={historyForm.task_description}
                onChange={(e) => setHistoryForm({ ...historyForm, task_description: e.target.value })}
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Notes (optional)</label>
              <input
                value={historyForm.notes}
                onChange={(e) => setHistoryForm({ ...historyForm, notes: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setShowForm(false); setHistoryForm(EMPTY_HISTORY) }}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm disabled:opacity-50"
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
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t === 'tasks'
              ? `Tasks (${openTasks.length} open)`
              : `History (${history.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-slate-400 py-20 text-center">Loading…</div>
      ) : tab === 'tasks' ? (
        openTasks.length === 0 && laterTasks.length === 0 ? (
          <div className="text-center py-20">
            <Wrench size={40} className="mx-auto text-slate-700 mb-3" />
            <p className="text-slate-500">No maintenance tasks yet.</p>
            <p className="text-slate-600 text-xs mt-1">Tasks are auto-created when anomalies trigger RCA workflows.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <SectionGroup
              title="Urgent — Due Soon"
              icon={<AlertCircle size={16} className="text-red-400" />}
              tasks={urgentTasks}
            />
            <SectionGroup
              title="Upcoming — Next 2 Weeks"
              icon={<Calendar size={16} className="text-emerald-400" />}
              tasks={upcomingTasks}
            />
            <SectionGroup
              title="Later"
              icon={<Clock size={16} className="text-slate-400" />}
              tasks={laterTasks}
            />
            {doneTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Check size={16} className="text-slate-500" />
                  <h2 className="text-sm font-semibold text-slate-500">Completed ({doneTasks.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doneTasks.map((t) => <TaskCard key={t._id ?? t.created_at} task={t} />)}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        history.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No maintenance history yet.</div>
        ) : (
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 px-6 py-3 bg-slate-800/60 border-b border-slate-700 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              <span>Equipment</span>
              <span>Description</span>
              <span>Technician</span>
              <span>Completed</span>
            </div>
            {history.map((h, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 px-6 py-4 hover:bg-slate-800/40 transition-colors ${
                  i < history.length - 1 ? 'border-b border-slate-800' : ''
                }`}
              >
                <span className="text-xs font-mono text-slate-400">{h.equipment_id}</span>
                <span className="text-sm text-slate-200">{h.task_description}</span>
                <span className="text-sm text-slate-400">{h.technician}</span>
                <span className="text-xs text-slate-500">
                  {h.completed_at ? new Date(h.completed_at).toLocaleDateString('en-GB') : '—'}
                </span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
