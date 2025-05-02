import type { Metadata } from "next";
import { Montserrat, Inter } from 'next/font/google'
import "@/styles/globals.css";
import { Web3Providers } from '@/components/web3/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth/auth-context"

export const metadata: Metadata = {
  title: 'Dynamic Vault - AI-Powered RWA Tokenization Platform',
  description: 'Real-time, market-responsive pricing of tokenized real-world assets',
}

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-montserrat flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Web3Providers>
            <AuthProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster />
            </AuthProvider>
          </Web3Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}