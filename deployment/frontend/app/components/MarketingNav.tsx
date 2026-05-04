'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

type NavChild = { label: string; href: string; desc: string };
type NavItem = { label: string; href?: string; children?: NavChild[] };

const NAV: NavItem[] = [
  {
    label: 'Product',
    children: [
      { label: 'Overview', href: '/product', desc: 'Everything DiagAI can do' },
      { label: 'Anomaly Detection', href: '/product/features/anomaly-detection', desc: 'LSTM-powered real-time fault detection' },
      { label: 'Multi-Agent RCA', href: '/product/features/multi-agent-rca', desc: 'LangGraph agents trace root causes automatically' },
      { label: 'Knowledge Graph', href: '/product/features/knowledge-graph', desc: 'Semantic reasoning over equipment data' },
      { label: 'Predictive Analytics', href: '/product/features/predictive-analytics', desc: 'Forecast failures before they occur' },
      { label: 'API', href: '/product/api', desc: 'Integrate DiagAI into your stack' },
    ],
  },
  {
    label: 'Solutions',
    children: [
      { label: 'Maintenance Engineers', href: '/solutions/maintenance-engineers', desc: 'Reduce MTTR with AI-guided diagnostics' },
      { label: 'Plant Managers', href: '/solutions/plant-managers', desc: 'Full fleet health at a glance' },
      { label: 'Enterprises', href: '/solutions/enterprises', desc: 'Multi-site, API-first, SLA-backed' },
      { label: 'Manufacturing', href: '/solutions/manufacturing', desc: 'CNC, pumps, motors, conveyors' },
      { label: 'Oil & Gas', href: '/solutions/oil-gas', desc: 'Compressors and rotating equipment' },
      { label: 'Reduce Downtime', href: '/solutions/reduce-downtime', desc: 'Cut unplanned downtime by up to 60%' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  {
    label: 'Resources',
    children: [
      { label: 'Documentation', href: '/resources/documentation', desc: 'Get started in minutes' },
      { label: 'Case Studies', href: '/resources/case-studies', desc: 'Real-world customer results' },
      { label: 'API Reference', href: '/resources/api-reference', desc: 'Full REST API docs' },
    ],
  },
  {
    label: 'Company',
    children: [
      { label: 'About Us', href: '/company/about', desc: 'Our mission and team' },
      { label: 'Careers', href: '/company/careers', desc: 'Open roles at DiagAI' },
      { label: 'Contact', href: '/company/contact', desc: 'Get in touch with us' },
      { label: 'Customers', href: '/customers', desc: 'See who uses DiagAI' },
    ],
  },
];

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 shrink-0">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
    <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
      DiagAI
    </span>
  </Link>
);

export default function MarketingNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (label: string) =>
    setOpenDropdown(prev => (prev === label ? null : label));

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-emerald-900/30"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV.map((item) => (
            <div key={item.label} className="relative">
              {item.href ? (
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-emerald-400 font-medium transition-colors rounded-lg hover:bg-slate-800/50"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => toggle(item.label)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    openDropdown === item.label
                      ? 'text-emerald-400 bg-slate-800/50'
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                  />
                </button>
              )}

              {/* Dropdown panel */}
              {item.children && openDropdown === item.label && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl shadow-black/50 py-2 z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-3 hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {child.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{child.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white font-medium transition-colors px-3 py-2"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-400 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            Start Free Trial →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-300 hover:text-white transition-colors p-1"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-3 max-h-[80vh] overflow-y-auto">
          {NAV.map((item) => (
            <div key={item.label} className="mb-0.5">
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggle(item.label)}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-800 pl-3">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => { setMobileOpen(false); setOpenDropdown(null); }}
                          className="block px-3 py-2 text-sm text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-center"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg text-center"
            >
              Start Free Trial →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
