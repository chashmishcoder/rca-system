import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RCA System - Root Cause Analysis Dashboard',
  description: 'AI-powered predictive maintenance and root cause analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                🔧 RCA System
              </h1>
              <div className="flex gap-4">
                <a href="/" className="hover:text-blue-600">Home</a>
                <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
                <a href="/analyze" className="hover:text-blue-600">Analyze</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600">
            <p>Multi-Agent RCA System | Phase 6 Complete ✅ | 95% Deployment Ready</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
