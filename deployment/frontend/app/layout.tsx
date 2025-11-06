import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RCA System - AI-Powered Root Cause Analysis',
  description: 'Next-generation predictive maintenance powered by Multi-Agent AI and Deep Learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900`}>
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="flex items-center gap-3 group">
                <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">🔧</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RCA System
                </span>
              </a>
              <div className="flex gap-6">
                <a 
                  href="/" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:scale-110 transform"
                >
                  Home
                </a>
                <a 
                  href="/analyze" 
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Analyze
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  )
}
