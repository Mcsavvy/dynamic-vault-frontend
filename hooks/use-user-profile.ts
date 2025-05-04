'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useProtectedFetch } from '@/lib/auth/use-protected-fetch'

export interface UserProfile {
  walletAddress: string
  roles: string[]
  createdAt: string
  lastLogin?: string
  profileInfo?: {
    username?: string
    email?: string
    avatarUrl?: string
    notificationPreferences?: {
      priceUpdates: boolean
      transactions: boolean
      marketEvents: boolean
      emailNotifications: boolean
    }
  }
  status: string
}

export function useUserProfile() {
  const { isAuthenticated, address } = useAuth()
  const { fetchData, isLoading: isFetchLoading, error: fetchError } = useProtectedFetch()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<Error | null>(null)

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated || !address) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchData<{ user: UserProfile }>('/api/users/profile')
      if (response) {
        setProfile(response.user)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, address, fetchData])

  // Update user profile
  const updateProfile = useCallback(async (data: Partial<UserProfile['profileInfo']>) => {
    if (!isAuthenticated || !address) {
      return false
    }

    try {
      const response = await fetchData<{ user: UserProfile }>('/api/users/profile', {
        method: 'PUT',
        body: data,
      })

      if (response) {
        setProfile(response.user)
        return true
      }
      return false
    } catch (err) {
      console.error('Error updating profile:', err)
      return false
    }
  }, [isAuthenticated, address, fetchData])

  // Upload profile image
  const uploadProfileImage = useCallback(async (file: File) => {
    if (!isAuthenticated || !address) {
      return false
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/users/profile/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      
      // Update local profile state with new avatar URL
      setProfile(prev => prev ? {
        ...prev,
        profileInfo: {
          ...prev.profileInfo,
          avatarUrl: data.avatarUrl
        }
      } : null)

      return true
    } catch (err) {
      console.error('Error uploading profile image:', err)
      setUploadError(err instanceof Error ? err : new Error('Failed to upload image'))
      return false
    } finally {
      setIsUploading(false)
    }
  }, [isAuthenticated, address])

  // Delete profile image
  const deleteProfileImage = useCallback(async () => {
    if (!isAuthenticated || !address) {
      return false
    }

    try {
      const response = await fetchData<{ success: boolean }>('/api/users/profile/image', {
        method: 'DELETE',
      })

      if (response?.success) {
        // Update local profile state to remove avatar URL
        setProfile(prev => prev ? {
          ...prev,
          profileInfo: {
            ...prev.profileInfo,
            avatarUrl: undefined
          }
        } : null)
        return true
      }
      return false
    } catch (err) {
      console.error('Error deleting profile image:', err)
      return false
    }
  }, [isAuthenticated, address, fetchData])

  // Initialize profile on mount and when auth state changes
  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  return {
    profile,
    isLoading: isLoading || isFetchLoading,
    error: error || fetchError,
    fetchUserProfile,
    updateProfile,
    uploadProfileImage,
    deleteProfileImage,
    isUploading,
    uploadError
  }
} 