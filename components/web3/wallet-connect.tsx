'use client'

import { useAccount, useDisconnect } from 'wagmi'
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

export function WalletConnectButton() {
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { toast } = useToast()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Format address for display (e.g., 0x1234...5678)
    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    if (isConnected) {
        return (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-teal-accent dark:text-white text-deep-navy">
                        <Wallet className="mr-2 h-4 w-4 text-teal-accent" />
                        {formatAddress(address || '')}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(address || '')
                            toast({
                                title: "Address Copied",
                                description: "Wallet address copied to clipboard",
                            })
                        }}
                    >
                        Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        disconnect()
                        toast({
                            title: "Wallet Disconnected",
                            description: "Your wallet has been disconnected.",
                        })
                    }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

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