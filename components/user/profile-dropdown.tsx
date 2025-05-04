'use client'

import { useState } from 'react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { WalletAvatar } from './wallet-avatar'
import { useAuth } from '@/lib/auth/auth-context'
import { useUserProfile } from '@/hooks/use-user-profile'
import Link from 'next/link'
import { LogOut, Settings, User as UserIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProfileDropdown() {
  const { address, logout } = useAuth()
  const { profile, isLoading } = useUserProfile()
  const [isOpen, setIsOpen] = useState(false)

  if (!address) return null
  
  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Get display name - username or formatted address
  const displayName = profile?.profileInfo?.username || formatAddress(address)
  
  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-1 relative h-10 w-10 rounded-full"
          aria-label="User menu"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : (
            <WalletAvatar 
              walletAddress={address} 
              customAvatarUrl={profile?.profileInfo?.avatarUrl} 
              size="md"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{address}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/profile/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 