import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="relative w-24 h-24 mb-6">
        <Image
          src="/images/logo.png"
          alt="DynamicVault Logo"
          fill
          className="object-contain"
        />
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-6">
        <AlertCircle className="h-8 w-8 text-teal-accent" />
        <h1 className="text-4xl font-bold text-foreground">404</h1>
      </div>
      
      <h2 className="text-2xl font-semibold text-foreground mb-4">
        Page Not Found
      </h2>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Please check the URL or navigate back to our homepage.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="teal" asChild>
          <Link href="/">Return to Homepage</Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href="/asset">Browse Assets</Link>
        </Button>
      </div>
      
      <div className="mt-12 p-6 bg-muted rounded-lg max-w-md mx-auto">
        <h3 className="text-lg font-medium text-foreground mb-3">
          Looking for something specific?
        </h3>
        <p className="text-muted-foreground mb-4">
          Check out these popular sections of our platform:
        </p>
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard" 
              className="text-ocean-blue hover:text-teal-accent transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/asset" 
              className="text-ocean-blue hover:text-teal-accent transition-colors"
            >
              Asset Marketplace
            </Link>
          </li>
          <li>
            <Link 
              href="/connect" 
              className="text-ocean-blue hover:text-teal-accent transition-colors"
            >
              Connect Wallet
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
} 