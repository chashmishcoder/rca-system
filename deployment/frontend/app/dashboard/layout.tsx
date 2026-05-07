'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import {
  LayoutDashboard,
  Bell,
  Activity,
  Settings,
  Wrench,
  History,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  User,
  ChevronDown,
  ScanSearch,
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://rca-backend-5jlv.onrender.com'

const NAV_ITEMS = [
  { href: '/dashboard',             label: 'Overview',        icon: LayoutDashboard },
  { href: '/analyze',               label: 'Analyze',         icon: ScanSearch },
  { href: '/dashboard/alerts',      label: 'Alerts',          icon: Bell },
  { href: '/dashboard/sensors',     label: 'Sensor Activity', icon: Activity },
  { href: '/dashboard/equipment',   label: 'Equipment',       icon: Settings },
  { href: '/dashboard/maintenance', label: 'Maintenance',     icon: Wrench },
  { href: '/dashboard/history',     label: 'History',         icon: History },
]

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':             { title: 'Dashboard',        subtitle: 'Real-time system monitoring and diagnostics' },
  '/dashboard/alerts':      { title: 'Alerts',           subtitle: 'Active system alerts and notifications' },
  '/dashboard/sensors':     { title: 'Sensor Activity',  subtitle: 'Real-time sensor readings and trends' },
  '/dashboard/equipment':   { title: 'Equipment',        subtitle: 'Equipment status and management' },
  '/dashboard/maintenance': { title: 'Maintenance',      subtitle: 'Predictive maintenance schedule' },
  '/dashboard/history':     { title: 'History',          subtitle: 'Historical anomaly records' },
  '/dashboard/settings':    { title: 'Settings',         subtitle: 'Profile and preferences' },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  const [darkMode,        setDarkMode]        = useState(true)
  const [alertCount,      setAlertCount]      = useState(0)
  const [profileOpen,     setProfileOpen]     = useState(false)
  const [notiOpen,        setNotiOpen]        = useState(false)
  const [recentAlerts,    setRecentAlerts]    = useState<any[]>([])
  const [userEmail,       setUserEmail]       = useState('')
  const [userName,        setUserName]        = useState('')
  const [userDesig,       setUserDesig]       = useState('')
  const profileRef  = useRef<HTMLDivElement>(null)
  const notiRef     = useRef<HTMLDivElement>(null)

  function loadProfile() {
    const em = localStorage.getItem('rca_user_email') || 'admin@rca.io'
    setUserEmail(em)
    setUserName(localStorage.getItem('rca_user_name') || '')
    setUserDesig(localStorage.getItem('rca_user_designation') || '')
    // Sync from DB in the background
    if (em) {
      fetch(`${API}/api/user/profile?email=${encodeURIComponent(em)}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.name)        { setUserName(data.name);        localStorage.setItem('rca_user_name', data.name) }
          if (data?.designation) { setUserDesig(data.designation); localStorage.setItem('rca_user_designation', data.designation) }
        })
        .catch(() => {})
    }
  }

  // ── auth check + load user info ──
  useEffect(() => {
    if (!localStorage.getItem('rca_authenticated')) {
      router.replace('/login')
    }
    loadProfile()
    window.addEventListener('rca_profile_updated', loadProfile)
    return () => window.removeEventListener('rca_profile_updated', loadProfile)
  }, [router])

  // ── dark mode persisted ──
  useEffect(() => {
    const saved = localStorage.getItem('rca_dark_mode')
    if (saved !== null) setDarkMode(saved === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('rca_dark_mode', String(darkMode))
    document.documentElement.classList.toggle('light-mode', !darkMode)
  }, [darkMode])

  // ── fetch alert count ──
  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch(`${API}/api/alerts?limit=5`)
        if (!res.ok) return
        const data = await res.json()
        setAlertCount(Array.isArray(data) ? data.length : 0)
        setRecentAlerts(Array.isArray(data) ? data.slice(0, 4) : [])
      } catch {}
    }
    fetchAlerts()
    const t = setInterval(fetchAlerts, 30_000)
    return () => clearInterval(t)
  }, [])

  // ── close dropdowns on outside click ──
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (notiRef.current   && !notiRef.current.contains(e.target as Node))     setNotiOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('rca_authenticated')
    localStorage.removeItem('rca_user_email')
    router.replace('/login')
  }

  const pageInfo = PAGE_TITLES[pathname] ?? { title: 'Dashboard', subtitle: '' }
  const displayName = userName || userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
  const displayDesig = userDesig || 'Operations Manager'

  const SEV_DOT: Record<string, string> = {
    critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-amber-400', low: 'bg-blue-400',
  }

  return (
    <div className={`flex min-h-screen text-slate-100 ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      {/* ── Sidebar ── */}
      <aside className={`w-60 shrink-0 flex flex-col border-r ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`px-6 py-5 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              DiagAI
            </span>
          </Link>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Industrial Dashboard</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className={`px-4 py-4 border-t space-y-2 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Right panel: header + content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Top Header ── */}
        <header className={`shrink-0 flex items-center justify-between px-6 py-3 border-b ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Page title */}
          <div>
            <h1 className={`font-bold text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{pageInfo.title}</h1>
            {pageInfo.subtitle && <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{pageInfo.subtitle}</p>}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1">

            {/* Dark / Light mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-amber-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div ref={notiRef} className="relative">
              <button
                onClick={() => { setNotiOpen(o => !o); setProfileOpen(false) }}
                title="Notifications"
                className={`relative p-2 rounded-lg transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
              >
                <Bell size={18} />
                {alertCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </button>

              {notiOpen && (
                <div className={`absolute right-0 mt-1 w-80 rounded-xl shadow-2xl border z-50 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <span className={`font-semibold text-sm ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Notifications</span>
                    {alertCount > 0 && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">{alertCount} active</span>}
                  </div>
                  <div className="py-1 max-h-64 overflow-y-auto">
                    {recentAlerts.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-6">No active alerts</p>
                    ) : recentAlerts.map((a: any, i: number) => (
                      <div key={i} className={`flex items-start gap-3 px-4 py-3 ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${SEV_DOT[a.severity] ?? 'bg-slate-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                            {a.message?.length > 60 ? a.message.slice(0, 60) + '…' : a.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{a.equipment_id} · {a.severity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`px-4 py-2 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <Link href="/dashboard/alerts" onClick={() => setNotiOpen(false)}
                      className="text-xs text-emerald-400 hover:underline">
                      View all alerts →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              href="/dashboard/settings"
              title="Settings"
              className={`p-2 rounded-lg transition-colors ${
                pathname === '/dashboard/settings'
                  ? 'text-emerald-400 bg-emerald-600/10'
                  : darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <Settings size={18} />
            </Link>

            {/* User profile dropdown */}
            <div ref={profileRef} className="relative ml-2">
              <button
                onClick={() => { setProfileOpen(o => !o); setNotiOpen(false) }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className={`text-sm font-semibold leading-none ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{displayName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{displayDesig}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className={`absolute right-0 mt-1 w-56 rounded-xl shadow-2xl border z-50 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`px-4 py-3 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{displayName}</p>
                    <p className="text-xs text-slate-500">{displayDesig}</p>
                    <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Settings size={14} />
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => { setDarkMode(d => !d); setProfileOpen(false) }}
                      className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
