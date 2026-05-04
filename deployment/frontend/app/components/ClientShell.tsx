'use client';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';

  const handleLogout = () => {
    localStorage.removeItem('rca_authenticated');
    localStorage.removeItem('rca_user_email');
    router.replace('/login');
  };

  return (
    <>
      {!isLoginPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/dashboard" className="flex items-center gap-3 group">
                <span className="text-2xl transform group-hover:rotate-12 transition-transform duration-300">🔧</span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RCA System
                </span>
              </a>
              <div className="flex gap-6 items-center">
                <a
                  href="/dashboard"
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300"
                >
                  Dashboard
                </a>
                <a
                  href="/analyze"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Analyze
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg text-sm font-medium transition-colors"
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
