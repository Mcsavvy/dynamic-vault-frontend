'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createAvatar } from '@dicebear/core'
import { shapes } from '@dicebear/collection'

interface WalletAvatarProps {
  walletAddress: string
  customAvatarUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function WalletAvatar({ 
  walletAddress, 
  customAvatarUrl, 
  size = 'md',
  className = '' 
}: WalletAvatarProps) {
  const [fallbackText, setFallbackText] = useState('')
  const [avatarSeed, setAvatarSeed] = useState('')
  const [error, setError] = useState(false)

  // Determine avatar size in pixels
  const sizeInPixels = {
    'sm': 'h-8 w-8',
    'md': 'h-10 w-10',
    'lg': 'h-12 w-12',
    'xl': 'h-16 w-16'
  }[size]

  // Generate fallback initial and seed for default avatar
  useEffect(() => {
    if (walletAddress) {
      // Get the first letter of the address for the fallback
      setFallbackText(walletAddress.substring(0, 2))
      
      // Use wallet address as seed for the avatar
      setAvatarSeed(walletAddress.toLowerCase())
    }
  }, [walletAddress])

  // Generate avatar URL using DiceBear
  const generateAvatarUrl = () => {
    try {
      const avatar = createAvatar(shapes, {
        seed: avatarSeed,
        backgroundColor: ['b6e3f4', 'c0aede', 'ffd5dc', 'ffdfbf'],
        shape1Color: ['0077b6', '023e8a', '0096c7', '00b4d8'],
        shape2Color: ['0077b6', '023e8a', '0096c7', '00b4d8'],
        shape3Color: ['0077b6', '023e8a', '0096c7', '00b4d8'],
      })

      return avatar.toDataUri()
    } catch (err) {
      console.error('Error generating avatar:', err)
      return ''
    }
  }

  const avatarUrl = customAvatarUrl || (avatarSeed ? generateAvatarUrl() : '')

  return (
    <Avatar className={`${sizeInPixels} ${className}`}>
      {avatarUrl && !error ? (
        <AvatarImage 
          src={avatarUrl} 
          alt={`${walletAddress}'s avatar`} 
          onError={() => setError(true)}
        />
      ) : null}
      <AvatarFallback className="bg-teal-accent/10 text-teal-accent">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  )
} 