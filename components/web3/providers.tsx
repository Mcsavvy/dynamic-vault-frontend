'use client'

import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/web3/wagmi-config'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface Web3ProvidersProps {
    children: React.ReactNode
}

// Create a client
const queryClient = new QueryClient()

export function Web3Providers({ children }: Web3ProvidersProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="light">
                    {children}
                    <Toaster />
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}