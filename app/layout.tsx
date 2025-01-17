import { Inter } from 'next/font/google'
import "./globals.css"
import Footer from './components/footer'
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Shot Tracker",
  description: "Track and analyze your goalkeeper performance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

