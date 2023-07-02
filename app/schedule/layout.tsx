"use client"
import { SessionProvider } from 'next-auth/react'
import './globals.css'
import Providers from '@/components/Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
          <SessionProvider>
        <Providers>
          {children}
        </Providers>
        </SessionProvider>
  )
}
