'use client';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login' || pathname.startsWith('/login/');

  const handleLogout = () => {
    localStorage.removeItem('rca_authenticated');
    localStorage.removeItem('rca_user_email');
    router.replace('/login');
  };

  return (
    <>
      {!isLoginPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/90 border-b border-emerald-900/40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/dashboard" className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  RCA System
                </span>
              </a>
              <div className="flex gap-6 items-center">
                <a
                  href="/dashboard"
                  className="text-slate-300 hover:text-emerald-400 font-medium transition-colors duration-200"
                >
                  Dashboard
                </a>
                <a
                  href="/analyze"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-200"
                >
                  Analyze
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-slate-400 hover:text-emerald-400 border border-slate-700 hover:border-emerald-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className={isLoginPage ? '' : 'pt-20'}>
        {children}
      </main>
    </>
  );
}
