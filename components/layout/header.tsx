'use client'

import Link from 'next/link'
import Image from 'next/image'
import { WalletConnectButton } from '@/components/web3/wallet-connect'
import { Button } from '@/components/ui/button'
import { BookOpen, BarChart3, Lock } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthNavigation } from '@/lib/auth/use-auth-navigation'

export function Header() {
  const { visibleNavItems, actionNavItems, isAuthenticated } = useAuthNavigation()

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="DynamicVault Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-montserrat font-bold text-xl text-foreground">
              DynamicVault
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {visibleNavItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className="text-muted-foreground font-medium hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <Link 
                href="/auth/connect"
                className="text-muted-foreground font-medium hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Protected Features</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-3">
            {actionNavItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button variant="ghost" size="sm" className="flex gap-2">
                  {item.label === 'Docs' ? (
                    <BookOpen className="h-4 w-4" />
                  ) : (
                    <BarChart3 className="h-4 w-4" />
                  )}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
          <ThemeToggle />
          <WalletConnectButton />
        </div>
      </div>
    </header>
  )
}
