import { ImageWithFallback } from '@/components/ui/image-with-fallback';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="relative w-20 h-20 mb-6 animate-bounce-slow">
        <ImageWithFallback
          src="/images/logo.png"
          alt="DynamicVault Logo"
          fill
          className="object-contain"
        />
      </div>
      
      <div className="flex flex-col items-center">
        <div className="h-2 w-48 bg-muted overflow-hidden rounded-full mb-4">
          <div className="h-full bg-teal-accent animate-pulse" style={{ width: '65%' }}></div>
        </div>
        
        <p className="text-muted-foreground">
          Loading content, please wait...
        </p>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="h-40 bg-muted animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 bg-muted w-3/4 rounded-full mb-3 animate-pulse"></div>
              <div className="h-3 bg-muted w-full rounded-full mb-2 animate-pulse"></div>
              <div className="h-3 bg-muted w-2/3 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 