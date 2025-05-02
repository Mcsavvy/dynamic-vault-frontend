'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Twitter, Github, Linkedin, ChevronDown, ChevronUp } from 'lucide-react'

export function Footer() {
  const [platformExpanded, setPlatformExpanded] = useState(false)
  const [companyExpanded, setCompanyExpanded] = useState(false)

  return (
    <footer className="w-full bg-background border-t border-border py-8 sm:py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/logo.png"
                  alt="DynamicVault Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-montserrat font-bold text-lg text-foreground">
                DynamicVault
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              DynamicVault is an AI-driven platform for tokenizing real-world assets with 
              dynamic pricing capabilities, enhancing liquidity and trust in decentralized markets.
            </p>
            <div className="flex gap-4 items-center mb-6 md:mb-0">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>
          
          {/* Platform Links - Collapsible on Mobile */}
          <div className="border-t md:border-t-0 pt-4 md:pt-0">
            <button 
              className="flex items-center justify-between w-full md:hidden mb-2"
              onClick={() => setPlatformExpanded(!platformExpanded)}
            >
              <h3 className="font-semibold text-foreground">Platform</h3>
              {platformExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            <h3 className="font-semibold text-foreground mb-4 hidden md:block">Platform</h3>
            
            <ul className={`space-y-2 ${platformExpanded ? 'block' : 'hidden md:block'}`}>
              <li>
                <Link href="/asset" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Browse Assets
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Transactions
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links - Collapsible on Mobile */}
          <div className="border-t md:border-t-0 pt-4 md:pt-0">
            <button 
              className="flex items-center justify-between w-full md:hidden mb-2"
              onClick={() => setCompanyExpanded(!companyExpanded)}
            >
              <h3 className="font-semibold text-foreground">Company</h3>
              {companyExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            <h3 className="font-semibold text-foreground mb-4 hidden md:block">Company</h3>
            
            <ul className={`space-y-2 ${companyExpanded ? 'block' : 'hidden md:block'}`}>
              <li>
                <Link href="/about" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-sm text-muted-foreground text-center">
          <p>© {new Date().getFullYear()} DynamicVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
