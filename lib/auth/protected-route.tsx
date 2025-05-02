'use client'

import { useEffect } from 'react'
import { useAuth } from './auth-context'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, redirectToAuth } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirectToAuth()
    }
  }, [isAuthenticated, isLoading, redirectToAuth])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-teal-accent animate-spin" />
        <span className="ml-2 text-muted-foreground">Verifying authentication...</span>
      </div>
    )
  }

  // If not authenticated and not loading, return null (will be redirected in useEffect)
  if (!isAuthenticated && !isLoading) {
    return null
  }

  // If authenticated, render the children
  return <>{children}</>
} 