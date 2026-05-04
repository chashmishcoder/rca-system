import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientShell from './components/ClientShell'

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
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
