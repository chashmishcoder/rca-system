import Link from 'next/link';

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/product' },
      { label: 'Anomaly Detection', href: '/product/features/anomaly-detection' },
      { label: 'Multi-Agent RCA', href: '/product/features/multi-agent-rca' },
      { label: 'Knowledge Graph', href: '/product/features/knowledge-graph' },
      { label: 'Predictive Analytics', href: '/product/features/predictive-analytics' },
      { label: 'API', href: '/product/api' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Maintenance Engineers', href: '/solutions/maintenance-engineers' },
      { label: 'Plant Managers', href: '/solutions/plant-managers' },
      { label: 'Enterprises', href: '/solutions/enterprises' },
      { label: 'Manufacturing', href: '/solutions/manufacturing' },
      { label: 'Oil & Gas', href: '/solutions/oil-gas' },
      { label: 'Reduce Downtime', href: '/solutions/reduce-downtime' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/resources/documentation' },
      { label: 'Case Studies', href: '/resources/case-studies' },
      { label: 'API Reference', href: '/resources/api-reference' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/company/about' },
      { label: 'Contact', href: '/company/contact' },
      { label: 'Customers', href: '/customers' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/legal/privacy' },
      { label: 'Terms of Service', href: '/legal/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-bold text-base bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                DiagAI
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Predict failures before they happen. AI-powered predictive maintenance for industrial equipment.
            </p>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} DiagAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="text-xs text-slate-600 hover:text-emerald-400 transition-colors">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-xs text-slate-600 hover:text-emerald-400 transition-colors">
              Terms
            </Link>
            <Link href="/company/contact" className="text-xs text-slate-600 hover:text-emerald-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
