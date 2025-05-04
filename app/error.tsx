'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="relative w-24 h-24 mb-6">
        <ImageWithFallback
          src="/images/logo.png"
          alt="DynamicVault Logo"
          fill
          className="object-contain"
        />
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-6">
        <AlertTriangle className="h-8 w-8 text-alert-red" />
        <h1 className="text-4xl font-bold text-foreground">Error</h1>
      </div>
      
      <h2 className="text-2xl font-semibold text-foreground mb-4">
        Something went wrong
      </h2>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        We&apos;ve encountered an unexpected error. Our team has been notified and is working to fix the issue.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="teal" 
          onClick={() => reset()}
        >
          Try Again
        </Button>
        
        <Button variant="outline" asChild>
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
      
      <div className="mt-12 p-6 bg-muted rounded-lg max-w-md mx-auto">
        <p className="text-sm text-muted-foreground">
          If you continue to experience issues, please contact our support team at{' '}
          <a href="mailto:support@dynamicvault.com" className="text-ocean-blue hover:text-teal-accent">
            support@dynamicvault.com
          </a>
        </p>
        
        {error.digest && (
          <p className="text-xs text-muted-foreground mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
} 