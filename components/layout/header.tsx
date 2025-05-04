'use client'

import Link from 'next/link'
import { useState } from 'react'
import { WalletConnectButton } from '@/components/web3/wallet-connect'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { 
  BookOpen, 
  BarChart3, 
  Lock,
  Menu,
  User,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthNavigation } from '@/lib/auth/use-auth-navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { ProfileDropdown } from '@/components/user/profile-dropdown'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'

export function Header() {
  const { visibleNavItems, actionNavItems, isAuthenticated } = useAuthNavigation()
  const { address } = useAuth()
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 sm:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <ImageWithFallback
                src="/images/logo.png"
                alt="DynamicVault Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-montserrat font-bold text-lg sm:text-xl text-foreground">
              DynamicVault
            </span>
          </Link>
          
          {/* Desktop Navigation */}
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

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Action Items */}
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

          {/* Mobile Action Items Dropdown */}
          <div className="md:hidden relative">
            {actionNavItems.length > 0 && (
              <Collapsible 
                open={isActionMenuOpen} 
                onOpenChange={setIsActionMenuOpen}
                className="relative"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute right-0 top-full mt-1 w-40 bg-background rounded-md shadow-md border border-border z-50">
                  <div className="py-1">
                    {actionNavItems.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href} 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                        onClick={() => setIsActionMenuOpen(false)}
                      >
                        {item.label === 'Docs' ? (
                          <BookOpen className="h-4 w-4" />
                        ) : (
                          <BarChart3 className="h-4 w-4" />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && address ? (
              <ProfileDropdown />
            ) : (
              <WalletConnectButton />
            )}
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <Link href="/" className="absolute left-4 top-2 flex items-center gap-2">
                  <div className="relative top-0 left-0 w-8 h-8">
                    <ImageWithFallback
                      src="/images/logo.png"
                      alt="DynamicVault Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="relative font-montserrat font-bold text-lg text-foreground">
                    DynamicVault
                  </p>
                </Link>
                <div className="flex flex-col h-full py-12">
                  <nav className="flex flex-col space-y-4">
                    {visibleNavItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link 
                          href={item.href}
                          className="text-foreground font-medium hover:text-primary transition-colors text-lg"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                    
                    {isAuthenticated && (
                      <SheetClose asChild>
                        <Link 
                          href="/profile"
                          className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-2 text-lg"
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </SheetClose>
                    )}
                    
                    {!isAuthenticated && (
                      <SheetClose asChild>
                        <Link 
                          href="/auth/connect"
                          className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-2 text-lg"
                        >
                          <Lock className="h-4 w-4" />
                          <span>Protected Features</span>
                        </Link>
                      </SheetClose>
                    )}
                  </nav>
                  
                  <div className="mt-auto">
                    <div className="flex justify-center">
                      <ThemeToggle />
                      <WalletConnectButton />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
