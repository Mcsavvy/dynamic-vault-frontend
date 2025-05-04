'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { useRouter, usePathname } from 'next/navigation'
import { SiweMessage } from 'siwe'

interface AuthContextType {
  isAuthenticated: boolean
  isConnecting: boolean
  isLoading: boolean
  address: string | undefined
  redirectToAuth: () => void
  login: () => Promise<boolean>
  logout: () => Promise<void>
  user: {
    walletAddress: string
    roles: string[]
  } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ walletAddress: string; roles: string[] } | null>(null)
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

  // Create a SIWE message for the user to sign
  const createSiweMessage = async (address: string, nonce: string) => {
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to DynamicVault.',
      uri: window.location.origin,
      version: '1',
      chainId: 1, // Ethereum mainnet
      nonce
    })
    return message.prepareMessage()
  }

  // Function to handle the login process with SIWE
  const login = async (): Promise<boolean> => {
    if (!address || !isConnected) return false

    try {
      setIsConnecting(true)

      // 1. Get a nonce from the server
      const nonceRes = await fetch(`/api/auth/nonce?walletAddress=${address}`)
      if (!nonceRes.ok) throw new Error('Failed to get nonce')
      const { nonce } = await nonceRes.json()

      // 2. Create SIWE message and have the user sign it
      const message = await createSiweMessage(address, nonce)
      const signature = await signMessageAsync({ message })

      // 3. Verify the signature with the server and get JWT tokens
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address, signature, message }),
      })

      if (!verifyRes.ok) throw new Error('Verification failed')
      
      const { accessToken, refreshToken } = await verifyRes.json()
      
      // 4. Store tokens (securely)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      // 5. Set authentication state
      setIsAuthenticated(true)
      setUser({ walletAddress: address, roles: ['user'] }) // You might want to get roles from the JWT
      
      // 6. Handle redirect
      const redirectPath = sessionStorage.getItem('redirectAfterAuth')
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterAuth')
        router.push(redirectPath)
      }
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  // Function to logout
  const logout = async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        // Call logout API
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens and state regardless of API success
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setIsAuthenticated(false)
      setUser(null)
      disconnect()
    }
  }

  // Effect to check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        
        if (accessToken && isConnected && address) {
          // Verify token is still valid with backend
          // This is a simple check; you might want to verify the token properly
          setIsAuthenticated(true)
          setUser({ walletAddress: address, roles: ['user'] }) // You might want to get roles from the JWT
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Short timeout to allow for wallet connection to initialize
    const timeout = setTimeout(() => {
      checkAuth()
    }, 500)
    
    return () => clearTimeout(timeout)
  }, [isConnected, address])

  // Effect to handle wallet connection changes
  useEffect(() => {
    if (!isConnected) {
      // If wallet disconnects, we should logout
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setIsAuthenticated(false)
      setUser(null)
    }
  }, [isConnected])

  // The value that will be provided to consumers of this context
  const value = {
    isAuthenticated,
    isConnecting,
    isLoading,
    address,
    redirectToAuth,
    login,
    logout,
    user
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