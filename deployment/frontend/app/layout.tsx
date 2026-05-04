import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientShell from './components/ClientShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DiagAI — AI-Powered Predictive Maintenance',
  description: 'Predict equipment failures before they happen. Multi-agent AI for real-time anomaly detection and root cause analysis.',
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
