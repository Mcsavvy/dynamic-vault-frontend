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
  const { isAuthenticated, redirectToAuth } = useAuth()

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

        // Prepare headers
        const headers = {
          'Content-Type': 'application/json',
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
          redirectToAuth()
          return null
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
    [isAuthenticated, redirectToAuth]
  )

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