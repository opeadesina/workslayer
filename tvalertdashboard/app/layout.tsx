import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link' // Import Link

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TradingView Alert Dashboard',
  description: 'Dashboard for TradingView Alerts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-gray-700">
              TV Dashboard
            </div>
            <nav className="flex-grow p-4">
              <ul>
                <li className="mb-2">
                  <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  {/* Link for Open Trades filter - will need query params or state */}
                  <Link href="/dashboard?status=open" className="block p-2 rounded hover:bg-gray-700">
                    Open Trades
                  </Link>
                </li>
                <li className="mb-2">
                   {/* Link for Closed Trades filter - will need query params or state */}
                  <Link href="/dashboard?status=closed" className="block p-2 rounded hover:bg-gray-700">
                    Closed Trades
                  </Link>
                </li>
                <li className="mb-2">
                  {/* Link for Settings page - create this page later */}
                  <Link href="/settings" className="block p-2 rounded hover:bg-gray-700">
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
