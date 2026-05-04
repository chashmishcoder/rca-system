'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const isAuth = localStorage.getItem('rca_authenticated');
    router.replace(isAuth ? '/dashboard' : '/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-slate-500 text-sm">Loading...</div>
    </div>
  );
}
