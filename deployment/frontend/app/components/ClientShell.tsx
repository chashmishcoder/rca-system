'use client';
import { usePathname } from 'next/navigation';
import MarketingNav from './MarketingNav';
import Footer from './Footer';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Auth pages: no chrome
  const isAuthPage =
    pathname === '/login' || pathname.startsWith('/login/') ||
    pathname === '/signup' || pathname.startsWith('/signup/');

  // App pages: have their own sidebar/layout
  const isAppPage =
    pathname.startsWith('/dashboard') ||
    pathname === '/analyze' || pathname.startsWith('/analyze/');

  if (isAuthPage || isAppPage) {
    return <>{children}</>;
  }

  return (
    <>
      <MarketingNav />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}
