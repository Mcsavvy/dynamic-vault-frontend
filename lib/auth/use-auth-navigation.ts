'use client'

import { useAuth } from './auth-context'

type NavigationItem = {
  label: string
  href: string
  requiresAuth: boolean
}

export function useAuthNavigation() {
  const { isAuthenticated } = useAuth()

  // Base navigation items always visible
  const baseNavItems: NavigationItem[] = [
    { label: 'Assets', href: '/asset', requiresAuth: false },
    { label: 'Marketplace', href: '/marketplace', requiresAuth: false },
  ]

  // Navigation items that require authentication
  const authNavItems: NavigationItem[] = [
    { label: 'Dashboard', href: '/dashboard', requiresAuth: true },
    { label: 'Portfolio', href: '/portfolio', requiresAuth: true },
    { label: 'Transactions', href: '/transactions', requiresAuth: true },
  ]

  // Action button items in the navigation based on auth state
  const actionNavItems: NavigationItem[] = [
    { label: 'Docs', href: '/docs', requiresAuth: false },
    { label: 'Stats', href: '/stats', requiresAuth: false },
  ]

  // Filter the navigation items based on authentication status
  const visibleNavItems = baseNavItems.concat(
    authNavItems.filter(item => !item.requiresAuth || isAuthenticated)
  )

  // Return all the navigation items and helper functions
  return {
    visibleNavItems,
    actionNavItems,
    isAuthenticated
  }
} 