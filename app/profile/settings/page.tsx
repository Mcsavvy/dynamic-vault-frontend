'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { ProtectedRoute } from '@/lib/auth/protected-route'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Loader2, 
  Camera, 
  User, 
  Trash2, 
  AlertCircle, 
  Save
} from 'lucide-react'
import { WalletAvatar } from '@/components/user/wallet-avatar'
import { useAuth } from '@/lib/auth/auth-context'

export default function ProfileSettingsPage() {
  return (
    <ProtectedRoute>
      <ProfileSettingsContent />
    </ProtectedRoute>
  )
}

function ProfileSettingsContent() {
  const { address } = useAuth()
  const { 
    profile, 
    isLoading, 
    error,
    updateProfile, 
    uploadProfileImage, 
    deleteProfileImage,
    isUploading,
    uploadError
  } = useUserProfile()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<{
    username?: string;
    email?: string;
    notificationPreferences?: {
      priceUpdates: boolean;
      transactions: boolean;
      marketEvents: boolean;
      emailNotifications: boolean;
    };
  }>({
    username: profile?.profileInfo?.username || '',
    email: profile?.profileInfo?.email || '',
    notificationPreferences: {
      priceUpdates: profile?.profileInfo?.notificationPreferences?.priceUpdates ?? true,
      transactions: profile?.profileInfo?.notificationPreferences?.transactions ?? true,
      marketEvents: profile?.profileInfo?.notificationPreferences?.marketEvents ?? true,
      emailNotifications: profile?.profileInfo?.notificationPreferences?.emailNotifications ?? false,
    }
  })
  const [isSaving, setIsSaving] = useState(false)

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        username: profile.profileInfo?.username || '',
        email: profile.profileInfo?.email || '',
        notificationPreferences: {
          priceUpdates: profile.profileInfo?.notificationPreferences?.priceUpdates ?? true,
          transactions: profile.profileInfo?.notificationPreferences?.transactions ?? true,
          marketEvents: profile.profileInfo?.notificationPreferences?.marketEvents ?? true,
          emailNotifications: profile.profileInfo?.notificationPreferences?.emailNotifications ?? false,
        }
      })
    }
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleCheckboxChange = (value: boolean, field: string) => {
    setFormData({
      ...formData,
      notificationPreferences: {
        ...formData.notificationPreferences!,
        [field]: value
      }
    })
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const success = await uploadProfileImage(file)
      if (success) {
        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been successfully updated.",
        })
      } else {
        toast({
          title: "Failed to Update Image",
          description: uploadError?.message || "There was an error uploading your image.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const handleImageDelete = async () => {
    try {
      const success = await deleteProfileImage()
      if (success) {
        toast({
          title: "Profile Image Removed",
          description: "Your profile image has been removed.",
        })
      } else {
        toast({
          title: "Failed to Remove Image",
          description: "There was an error removing your profile image.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    
    try {
      const success = await updateProfile({
        username: formData.username,
        email: formData.email,
        notificationPreferences: formData.notificationPreferences
      })
      
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      } else {
        toast({
          title: "Failed to Update Profile",
          description: "There was an error updating your profile.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

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

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your personal information and preferences
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
            <CardDescription>
              Your profile picture will be visible to other users
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-6">
              <WalletAvatar 
                walletAddress={address!} 
                customAvatarUrl={profile?.profileInfo?.avatarUrl} 
                size="xl" 
                className="h-24 w-24"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                {profile?.profileInfo?.avatarUrl ? 'Change' : 'Upload'}
              </Button>
              
              {profile?.profileInfo?.avatarUrl && (
                <Button 
                  onClick={handleImageDelete} 
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter a username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Used for notifications and account recovery
              </p>
            </div>
            
            <div className="space-y-2 pt-4">
              <Label>Wallet Address</Label>
              <div className="flex items-center rounded-md border p-2 bg-muted/50">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-mono">
                  {address}
                </span>
              </div>
            </div>
          </CardContent>
          
          <Separator className="my-4" />
          
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Control how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="priceUpdates"
                checked={formData.notificationPreferences?.priceUpdates}
                onCheckedChange={(value) => 
                  handleCheckboxChange(value as boolean, 'priceUpdates')
                }
              />
              <Label htmlFor="priceUpdates" className="font-normal cursor-pointer">
                Price Updates
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="transactions"
                checked={formData.notificationPreferences?.transactions}
                onCheckedChange={(value) => 
                  handleCheckboxChange(value as boolean, 'transactions')
                }
              />
              <Label htmlFor="transactions" className="font-normal cursor-pointer">
                Transaction Notifications
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="marketEvents"
                checked={formData.notificationPreferences?.marketEvents}
                onCheckedChange={(value) => 
                  handleCheckboxChange(value as boolean, 'marketEvents')
                }
              />
              <Label htmlFor="marketEvents" className="font-normal cursor-pointer">
                Market Events
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="emailNotifications"
                checked={formData.notificationPreferences?.emailNotifications}
                onCheckedChange={(value) => 
                  handleCheckboxChange(value as boolean, 'emailNotifications')
                }
              />
              <Label htmlFor="emailNotifications" className="font-normal cursor-pointer">
                Email Notifications
              </Label>
            </div>
          </CardContent>
          
          <CardFooter className="border-t p-6">
            <Button 
              onClick={handleSubmit} 
              disabled={isSaving}
              className="ml-auto"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 