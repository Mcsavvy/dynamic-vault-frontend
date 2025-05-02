'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  address: string | undefined
  redirectToAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Function to redirect to auth page
  const redirectToAuth = () => {
    // Save the current page URL to redirect back after authentication
    if (pathname !== '/auth/connect') {
      sessionStorage.setItem('redirectAfterAuth', pathname)
    }
    router.push('/auth/connect')
  }

  // Check authentication status when component mounts
  useEffect(() => {
    // Short timeout to allow for wallet connection to initialize
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timeout)
  }, [])

  // Handle successful authentication redirect
  useEffect(() => {
    if (isConnected && !isLoading) {
      const redirectPath = sessionStorage.getItem('redirectAfterAuth')
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterAuth')
        router.push(redirectPath)
      }
    }
  }, [isConnected, isLoading, router])

  // The value that will be provided to consumers of this context
  const value = {
    isAuthenticated: isConnected,
    isLoading,
    address,
    redirectToAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 