'use client'

import { ProtectedRoute } from '@/lib/auth/protected-route'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useAuth } from '@/lib/auth/auth-context'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Loader2, 
  AlertCircle, 
  Settings, 
  Calendar, 
  Mail, 
  ExternalLink 
} from 'lucide-react'
import { WalletAvatar } from '@/components/user/wallet-avatar'
import Link from 'next/link'
import { format } from 'date-fns'

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { address } = useAuth()
  const { profile, isLoading, error } = useUserProfile()
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <p className="text-destructive font-medium mb-2">Error Loading Profile</p>
        <p className="text-muted-foreground text-center max-w-md">
          There was a problem loading your profile information. Please try again later.
        </p>
      </div>
    )
  }

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Get display name - username or formatted address
  const displayName = profile?.profileInfo?.username || formatAddress(address || '')
  
  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'PPP')
    } catch {
      return 'Invalid date'
    }
  }

  const joinedDate = formatDate(profile?.createdAt)
  const lastLoginDate = formatDate(profile?.lastLogin)
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button asChild>
          <Link href="/profile/settings">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <WalletAvatar 
                walletAddress={address || ''} 
                customAvatarUrl={profile?.profileInfo?.avatarUrl} 
                size="xl" 
                className="h-24 w-24"
              />
            </div>
            <CardTitle className="text-xl">{displayName}</CardTitle>
            <CardDescription>
              <span className="font-mono text-xs">{address}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile?.profileInfo?.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{profile.profileInfo.email}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Joined: {joinedDate}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Last login: {lastLoginDate}</span>
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  asChild
                >
                  <Link 
                    href={`https://etherscan.io/address/${address}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Etherscan
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity Overview */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              Your recent activity on DynamicVault
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-6">
                Your activity history will appear here.
              </p>
              <Button asChild variant="outline">
                <Link href="/transactions">
                  View All Transactions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 