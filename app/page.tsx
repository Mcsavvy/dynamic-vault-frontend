import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletConnectButton } from "@/components/web3/wallet-connect";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { 
  ChevronRight, 
  ArrowRight, 
  Shield, 
  Users, 
  Globe, 
  DollarSign, 
  Check, 
  Star, 
  TrendingUp, 
  Coins,
  BarChart2,
  Tag,
  RefreshCw
} from "lucide-react";

// Mock data for featured assets - structured to reflect RWAAssetContract
const FEATURED_ASSETS = [
  {
    id: "1",
    tokenId: 1,
    name: "Blue Chip Art Collection",
    description: "Premium art pieces from renowned contemporary artists",
    imageUrl: "/images/asset-art.jpg",
    initialPrice: "100,000",
    currentPrice: "120,000",
    priceChange: "+3.2%",
    confidenceScore: 98,
    lastUpdate: "2023-04-28",
    assetType: "ART",
    isListed: true,
    listingPrice: "125,000"
  },
  {
    id: "2",
    tokenId: 2,
    name: "Luxury Real Estate Bundle",
    description: "Tokenized high-end properties in premium locations",
    imageUrl: "/images/asset-realestate.jpg",
    initialPrice: "2,400,000",
    currentPrice: "2,450,000",
    priceChange: "+1.5%",
    confidenceScore: 95,
    lastUpdate: "2023-04-26",
    assetType: "REAL_ESTATE",
    isListed: true,
    listingPrice: "2,500,000"
  },
  {
    id: "3",
    tokenId: 3,
    name: "Rare Wine Collection",
    description: "Vintage and limited edition wines with provenance",
    imageUrl: "/images/asset-collectible.jpg",
    initialPrice: "70,000",
    currentPrice: "75,000",
    priceChange: "+2.8%",
    confidenceScore: 92,
    lastUpdate: "2023-04-27",
    assetType: "COLLECTIBLE",
    isListed: false,
    listingPrice: null
  }
];

// Statistics data
const STATS = [
  { value: "$420M+", label: "Total Value Tokenized", icon: DollarSign },
  { value: "24,500+", label: "Unique Investors", icon: Users },
  { value: "99.8%", label: "Uptime Reliability", icon: Shield },
  { value: "45+", label: "Supported Countries", icon: Globe },
];

// Smart contract features data
const CONTRACT_FEATURES = [
  {
    title: "RWA Asset Contract",
    description: "Secure tokenization of real-world assets with full ERC-721 compatibility and fractional ownership support",
    icon: Coins,
    features: [
      "Compliant asset tokenization",
      "Fractional ownership capabilities",
      "Transparent ownership records",
      "Built-in transfer restrictions"
    ]
  },
  {
    title: "Dynamic Pricing Agent",
    description: "AI-powered price discovery engine that automatically updates asset valuations based on market data",
    icon: BarChart2,
    features: [
      "Real-time market data integration",
      "Confidence score calculation",
      "Historical price tracking",
      "Multiple data source validation"
    ]
  },
  {
    title: "Marketplace Contract",
    description: "Decentralized platform for listing, buying, and selling tokenized real-world assets, with a transparent fee.",
    icon: Tag,
    features: [
      "Secure peer-to-peer transactions",
      "Dynamic listing management",
      "Transparent fee structure",
      "Automated settlement",
    ]
  }
];

// Testimonials data
const TESTIMONIALS = [
  {
    quote: "DynamicVault has transformed how we manage our art collection. The dynamic pricing model ensures we always get fair market value.",
    author: "Emily Chen",
    position: "Art Fund Manager",
    rating: 5
  },
  {
    quote: "The transparency and confidence scores give us peace of mind when investing in real estate tokens. A game-changer for our portfolio strategy.",
    author: "Michael Peterson",
    position: "Investment Director",
    rating: 5
  },
  {
    quote: "We've seen a 32% increase in liquidity for our rare collectibles since tokenizing them on DynamicVault. The AI valuation is remarkably accurate.",
    author: "Sarah Johnson",
    position: "Collectibles Dealer",
    rating: 4
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-deep-navy to-ocean-blue dark:from-deep-navy/80 dark:to-ocean-blue/80 text-white py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-ocean-blue/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="teal" className="mb-4 py-1.5">
                Smart Contract Powered Asset Tokenization
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
                <span className="text-teal-accent">AI-Powered</span> Tokenization for Real-World Assets
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                DynamicVault revolutionizes liquidity for tokenized real assets with dynamic, 
                market-responsive pricing and blockchain-secured ownership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <WalletConnectButton />
                <Link href="/asset" passHref>
                  <Button variant="outline" className="border-white border-opacity-30 dark:text-white hover:bg-white hover:bg-opacity-10">
                    Explore Assets
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 bg-teal-accent/10 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                <div className="relative w-[95%] h-[95%]">
                  <ImageWithFallback 
                    src="/images/dashboard-preview.png" 
                    alt="DynamicVault Platform Preview"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-accent/30 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/20 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {STATS.map((stat, index) => (
              <div key={index} className="text-center p-4 backdrop-blur-sm bg-white/5 rounded-lg">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-teal-accent" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blockchain Smart Contract Section - NEW */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Smart Contracts</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powered by Blockchain Technology
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is built on advanced smart contracts that enable secure, transparent, and efficient tokenization and trading of real-world assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONTRACT_FEATURES.map((feature, index) => (
              <div key={index} className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="p-6">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 border-t border-border">
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 text-primary mr-2" />
                    <span className="text-xs text-muted-foreground">Last updated: 2 days ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How DynamicVault Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes it easy to tokenize, trade, and track real-world assets with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line in the background */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border"></div>
            
            {/* Step 1 */}
            <div className="relative bg-card border border-border rounded-lg p-8 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-teal-accent text-white dark:text-deep-navy w-10 h-10 rounded-full flex items-center justify-center font-bold">1</div>
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">Asset Submission</h3>
                <p className="text-muted-foreground mb-4">
                  Submit your asset for evaluation with detailed documentation and verification.
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-accent mr-2 shrink-0" />
                    <span>Simple documentation process</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-accent mr-2 shrink-0" />
                    <span>Verification by industry experts</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative bg-card border border-border rounded-lg p-8 transition-all hover:shadow-md hover:-translate-y-1 duration-300" style={{ transitionDelay: '0.1s' }}>
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-teal-accent text-white dark:text-deep-navy w-10 h-10 rounded-full flex items-center justify-center font-bold">2</div>
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">AI Valuation</h3>
                <p className="text-muted-foreground mb-4">
                  Our AI engine analyzes market data to determine fair, dynamic pricing for your asset.
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-accent mr-2 shrink-0" />
                    <span>Advanced market analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-accent mr-2 shrink-0" />
                    <span>Confidence score calculation</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative bg-card border border-border rounded-lg p-8 transition-all hover:shadow-md hover:-translate-y-1 duration-300" style={{ transitionDelay: '0.2s' }}>
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-teal-accent text-white dark:text-deep-navy w-10 h-10 rounded-full flex items-center justify-center font-bold">3</div>
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">Trade & Track</h3>
                <p className="text-muted-foreground mb-4">
                  Buy, sell, and monitor your tokenized assets with real-time updates and insights.
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-accent mr-2 shrink-0" />
                    <span>Real-time price tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-accent mr-2 shrink-0" />
                    <span>Seamless trading experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Featured Assets Section with Blockchain Data */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Assets</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Tokenized Assets
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our selection of high-quality tokenized assets with real-time blockchain pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_ASSETS.map((asset) => (
              <div key={asset.id} className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="relative h-48 w-full">
                  <ImageWithFallback 
                    src={asset.imageUrl}
                    alt={asset.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 text-white border-none">
                      {asset.assetType}
                    </Badge>
                  </div>
                  {asset.isListed && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-teal-accent/20 text-teal-accent border-teal-accent/30">
                        <Tag className="h-3 w-3 mr-1" />
                        For Sale
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{asset.name}</h3>
                    <span className="text-xs text-muted-foreground">ID: {asset.tokenId}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{asset.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="text-xl font-bold text-foreground">${asset.currentPrice}</p>
                      <p className="text-xs text-muted-foreground">Initial: ${asset.initialPrice}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline" className={`${asset.priceChange.startsWith('+') ? 'bg-green-50 dark:bg-transparent text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {asset.priceChange}
                      </Badge>
                      <span className="text-xs text-muted-foreground mt-1">Updated: {asset.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="h-2 bg-muted rounded-full w-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${asset.confidenceScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground ml-2">{asset.confidenceScore}%</span>
                  </div>
                  
                  <Link href={`/asset/${asset.id}`} passHref>
                    <Button className="w-full dark:text-deep-navy">
                      {asset.isListed ? `Buy for $${asset.listingPrice}` : 'View Asset'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/asset" passHref>
              <Button variant="outline">
                View All Assets
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their asset management with DynamicVault.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-8 hover:shadow-md transition-all relative">
                <div className="absolute -top-5 right-8 text-primary">
                  <svg width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.44 35C9.12 35 5.76 33.6 3.36 30.8C1.12 28 0 24.4 0 20C0 15.44 1.44 11.28 4.32 7.52C7.2 3.76 11.52 1.12 17.28 -0.000000125L19.2 4.96C15.36 5.92 12.4 7.52 10.32 9.76C8.24 12 7.2 14.4 7.2 16.96C7.2 17.92 7.52 18.72 8.16 19.36C8.8 19.84 9.76 20.32 11.04 20.8C13.76 21.76 15.68 22.88 16.8 24.16C18.08 25.44 18.72 27.36 18.72 29.92C18.72 31.52 18.08 32.88 16.8 34C15.68 34.67 14.4 35 13.44 35ZM37.92 35C33.6 35 30.24 33.6 27.84 30.8C25.6 28 24.48 24.4 24.48 20C24.48 15.44 25.92 11.28 28.8 7.52C31.68 3.76 36 1.12 41.76 -0.000000125L43.68 4.96C39.84 5.92 36.88 7.52 34.8 9.76C32.72 12 31.68 14.4 31.68 16.96C31.68 17.92 32 18.72 32.64 19.36C33.28 19.84 34.24 20.32 35.52 20.8C38.24 21.76 40.16 22.88 41.28 24.16C42.56 25.44 43.2 27.36 43.2 29.92C43.2 31.52 42.56 32.88 41.28 34C40.16 34.67 38.88 35 37.92 35Z" fill="currentColor" fillOpacity="0.2"/>
                  </svg>
                </div>
                <div className="flex mb-4 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill={i < testimonial.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <p className="text-foreground italic mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-deep-navy to-ocean-blue dark:from-deep-navy/80 dark:to-ocean-blue/80 text-white py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-ocean-blue/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="teal" className="mb-6 py-1.5">Get Started Today</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Transform Your Asset Portfolio?
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join DynamicVault today and experience the future of asset tokenization with AI-powered price discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <WalletConnectButton />
            <Link href="/docs" passHref>
              <Button variant="outline" className="border-white border-opacity-30 dark:text-white hover:bg-white hover:bg-opacity-10">
                Learn How It Works
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
