'use client'

import { useAccount } from 'wagmi'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import WalletModal from './wallet-modal'
import { useAuth } from '@/lib/auth/auth-context'

export function WalletConnectButton() {
    const { address, isConnected } = useAccount()
    const { toast } = useToast()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { isAuthenticated, isConnecting, login, logout } = useAuth()

    // Format address for display (e.g., 0x1234...5678)
    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    // Handle disconnect
    const handleDisconnect = async () => {
        await logout()
        toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
        })
        setIsDropdownOpen(false)
    }

    // Handle signing message for auth after wallet connection
    const handleSignIn = async () => {
        try {
            const success = await login()
            if (success) {
                toast({
                    title: "Authentication Successful",
                    description: "You are now authenticated with DynamicVault.",
                })
            } else {
                toast({
                    title: "Authentication Failed",
                    description: "Failed to authenticate. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Authentication error:", error)
            toast({
                title: "Authentication Error",
                description: "An error occurred during authentication.",
                variant: "destructive",
            })
        }
    }

    // If wallet is connected but not authenticated, prompt for authentication
    if (isConnected && !isAuthenticated) {
        return (
            <Button 
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={handleSignIn}
                disabled={isConnecting}
            >
                {isConnecting ? "Authenticating..." : "Authenticate Wallet"}
            </Button>
        )
    }

    // If authenticated, show wallet address and dropdown
    if (isAuthenticated && address) {
        return (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-teal-accent text-teal-accent hover:bg-teal-accent/10">
                        <Wallet className="mr-2 h-4 w-4" />
                        {formatAddress(address)}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDisconnect}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    // If not connected, show connect button
    return (
        <>
            <Button 
                className="bg-teal-accent hover:bg-teal-accent/90 text-white"
                onClick={() => setIsModalOpen(true)}
            >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
            </Button>

            <WalletModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    )
}