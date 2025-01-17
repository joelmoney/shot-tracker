'use client'

import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen bg-background">
      {!isHome && (
        <header className="border-b">
          <div className="container flex h-14 items-center px-4">
            <h1 className="text-lg font-semibold">Shot Tracker</h1>
          </div>
        </header>
      )}
      <main className={isHome ? undefined : "container p-4"}>{children}</main>
    </div>
  )
}

