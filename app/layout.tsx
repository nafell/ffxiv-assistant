import { SessionProvider } from 'next-auth/react'
import './globals.css'
import Providers from '@/components/Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">
        <Providers>
          {children}
        </Providers>
        </main>
      </body>
    </html>
  )
}
