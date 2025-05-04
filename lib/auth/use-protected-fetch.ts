'use client'

import { useState, useCallback } from 'react'
import { useAuth } from './auth-context'

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown;
  headers?: Record<string, string>
}

export function useProtectedFetch() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { isAuthenticated, redirectToAuth, logout } = useAuth()

  const fetchData = useCallback(
    async <T>(url: string, options: FetchOptions = {}): Promise<T | null> => {
      // Reset state
      setIsLoading(true)
      setError(null)

      try {
        // Check if user is authenticated
        if (!isAuthenticated) {
          redirectToAuth()
          return null
        }

        // Get token from localStorage
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          redirectToAuth()
          return null
        }

        // Prepare headers with authorization token
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          ...options.headers,
        }

        // Make the API request
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
        })

        // Handle unauthorized response
        if (response.status === 401) {
          // Try to refresh the token
          const refreshResult = await refreshAccessToken()
          
          // If refresh fails, redirect to login
          if (!refreshResult.success) {
            await logout()
            redirectToAuth()
            return null
          }
          
          // Retry the request with the new token
          const retryResponse = await fetch(url, {
            method: options.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshResult.accessToken}`,
              ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
          })
          
          // If still unauthorized, redirect to login
          if (retryResponse.status === 401) {
            await logout()
            redirectToAuth()
            return null
          }
          
          // Return the retry response data
          const retryData = await retryResponse.json()
          return retryData as T
        }

        // Handle other errors
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        // Parse and return response
        const data = await response.json()
        return data as T
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred')
        setError(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, redirectToAuth, logout]
  )

  // Helper function to refresh access token
  const refreshAccessToken = async (): Promise<{ success: boolean, accessToken?: string }> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        return { success: false }
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        return { success: false }
      }

      const data = await response.json()
      localStorage.setItem('accessToken', data.accessToken)
      
      return { 
        success: true,
        accessToken: data.accessToken
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      return { success: false }
    }
  }

  return { fetchData, isLoading, error }
}

// Usage example:
/*
function MyComponent() {
  const { fetchData, isLoading, error } = useProtectedFetch()
  const [data, setData] = useState(null)

  const loadData = async () => {
    const result = await fetchData('/api/protected-endpoint')
    if (result) {
      setData(result)
    }
  }

  // ...
}
*/