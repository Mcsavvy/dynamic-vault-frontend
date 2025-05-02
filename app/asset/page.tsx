import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronDown, CheckCircle, Clock, Tag } from 'lucide-react';

// Mock asset data reflecting the RWAAssetContract structure
const ASSETS = [
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
    assetLocation: "Secure Storage, New York",
    acquisitionDate: "2023-01-15",
    isVerified: true,
    isListed: true,
    owner: "0x7a16Ff8270133F063aAb6C9977183D9e72835539"
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
    assetLocation: "Miami, FL",
    acquisitionDate: "2022-11-03",
    isVerified: true,
    isListed: true,
    owner: "0x9B3e39C22f0f9d3D4C33c71D681EB06F04DCD9EA"
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
    assetLocation: "Temperature-controlled vault, Bordeaux",
    acquisitionDate: "2023-02-22",
    isVerified: true,
    isListed: false,
    owner: "0x7a16Ff8270133F063aAb6C9977183D9e72835539"
  },
  {
    id: "4",
    tokenId: 4,
    name: "Vintage Watch Portfolio",
    description: "Rare and limited edition timepieces from prestigious manufacturers",
    imageUrl: "/images/asset-art.jpg",
    initialPrice: "325,000",
    currentPrice: "350,000",
    priceChange: "+1.2%",
    confidenceScore: 96,
    lastUpdate: "2023-04-25",
    assetType: "LUXURY_GOODS",
    assetLocation: "Private Collection, Geneva",
    acquisitionDate: "2022-12-10",
    isVerified: true,
    isListed: true,
    owner: "0x8C1bD71A1bBcD387642F478fC0D9f249ac1d0b6E"
  },
  {
    id: "5",
    tokenId: 5,
    name: "Commercial Property Fund",
    description: "Diversified portfolio of income-generating commercial properties",
    imageUrl: "/images/asset-realestate.jpg",
    initialPrice: "5,950,000",
    currentPrice: "5,800,000",
    priceChange: "-0.5%",
    confidenceScore: 94,
    lastUpdate: "2023-04-29",
    assetType: "REAL_ESTATE",
    assetLocation: "Chicago, IL",
    acquisitionDate: "2022-09-18",
    isVerified: true,
    isListed: true,
    owner: "0x5a34F8C90B8A6F28F17080B7Ed96B877D79D1702"
  },
  {
    id: "6",
    tokenId: 6,
    name: "Sports Memorabilia Collection",
    description: "Authenticated sports collectibles with historical significance",
    imageUrl: "/images/asset-collectible.jpg",
    initialPrice: "210,000",
    currentPrice: "225,000",
    priceChange: "+4.2%",
    confidenceScore: 91,
    lastUpdate: "2023-04-24",
    assetType: "COLLECTIBLE",
    assetLocation: "Sports Museum Storage, Dallas",
    acquisitionDate: "2023-01-05",
    isVerified: false,
    isListed: false,
    owner: "0x3F8C1bD71A1bBcD387642F478fC0D9f249ac1d0b"
  }
];

export default function AssetListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-deep-navy dark:text-foreground mb-2">Explore Assets</h1>
          <p className="text-slate dark:text-muted-foreground">Discover tokenized real-world assets with dynamic pricing</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link href="/portfolio">
            <Button variant="outline" className="flex items-center gap-2">
              My Portfolio
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            Sort by
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input 
          type="text" 
          placeholder="Search assets by name, category, or description..." 
          className="w-full pl-10"
        />
      </div>
      
      {/* Asset grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ASSETS.map((asset) => (
          <Link href={`/asset/${asset.id}`} key={asset.id} className="group h-full">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm transition-all group-hover:shadow-md h-full flex flex-col">
              {/* Image and badge section */}
              <div className="relative h-48 w-full bg-muted flex-shrink-0">
                <div className="absolute top-2 right-2 z-10">
                  <Badge variant="navy">
                    {asset.assetType.replace('_', ' ')}
                  </Badge>
                </div>
                {asset.isListed && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="outline" className="bg-teal-accent/20 text-teal-accent border-teal-accent/30">
                      <Tag className="h-3 w-3 mr-1" />
                      For Sale
                    </Badge>
                  </div>
                )}
                <Image 
                  src={asset.imageUrl} 
                  alt={asset.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Asset details section */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Title and verification status */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-ocean-blue transition-colors">
                    {asset.name}
                  </h3>
                  {asset.isVerified ? (
                    <Badge variant="outline" className="bg-green-50 dark:bg-transparent text-green-600 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 dark:bg-transparent text-yellow-600 border-yellow-200">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                
                {/* Asset token ID and location */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Token ID: {asset.tokenId}</span>
                  <span>{asset.assetLocation}</span>
                </div>
                
                {/* Asset description */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {asset.description}
                </p>
                
                {/* Pricing info */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-foreground font-bold">${asset.currentPrice}</p>
                    <p className={`text-xs font-medium ${asset.priceChange.startsWith('+') ? 'text-success-green' : 'text-alert-red'}`}>
                      {asset.priceChange} (24h)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground text-right">Last updated</p>
                    <p className="text-xs text-muted-foreground">{asset.lastUpdate}</p>
                  </div>
                </div>
                
                {/* This will push the confidence score to the bottom */}
                <div className="mt-auto pt-4">
                  {/* Confidence score */}
                  <div className="flex items-center">
                    <div className="h-2 bg-muted rounded-full w-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${asset.confidenceScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground ml-2">{asset.confidenceScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="teal" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}