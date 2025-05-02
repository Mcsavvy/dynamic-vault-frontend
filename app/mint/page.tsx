'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  FileUp, 
  ImagePlus, 
  Landmark, 
  CircleDollarSign, 
  FileText, 
  Check, 
  Info, 
  Clock, 
  AlertCircle,
  Loader2
} from 'lucide-react'

// Asset types available for tokenization
const ASSET_TYPES = [
  { id: "ART", name: "Art Collection", description: "Fine art, paintings, sculptures, etc." },
  { id: "REAL_ESTATE", name: "Real Estate", description: "Properties, land, buildings, etc." },
  { id: "COLLECTIBLE", name: "Collectibles", description: "Rare items, memorabilia, etc." },
  { id: "LUXURY_GOODS", name: "Luxury Goods", description: "High-end watches, jewelry, etc." },
  { id: "COMMODITY", name: "Commodities", description: "Precious metals, materials, etc." }
]

export default function MintPage() {
  const { address } = useAuth()
  const isConnected = !!address
  const { toast } = useToast()
  
  // Form state
  const [assetName, setAssetName] = useState('')
  const [description, setDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [assetType, setAssetType] = useState('')
  const [initialPrice, setInitialPrice] = useState('')
  const [location, setLocation] = useState('')
  const [supply, setSupply] = useState('1')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [documents, setDocuments] = useState<File[]>([])
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('details')
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Handle document upload
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files)
      setDocuments(prev => [...prev, ...fileList])
    }
  }
  
  // Remove document
  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint a new asset",
        variant: "destructive"
      })
      return
    }
    
    if (!imageFile) {
      toast({
        title: "Image required",
        description: "Please upload an image for your asset",
        variant: "destructive"
      })
      return
    }
    
    // Simulate minting process
    setIsUploading(true)
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 300)
    
    // Simulate API call to mint token
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setIsUploading(false)
      
      toast({
        title: "Asset successfully tokenized",
        description: "Your real-world asset has been minted as a token on the blockchain",
      })
      
      // In a real implementation, this would redirect to the newly created asset
    }, 5000)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="mb-6 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <FileUp className="mr-2 h-6 w-6 text-primary" />
            Mint New Asset
          </h1>
          <p className="text-muted-foreground">
            Tokenize your real-world assets on the blockchain using the RWAAssetContract
          </p>
          
          {!isConnected && (
            <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Please connect your wallet to mint new assets. You&apos;ll need to sign the transaction to complete the minting process.
              </p>
            </div>
          )}
        </div>
        
        <Tabs value={currentStep} onValueChange={setCurrentStep} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" disabled={isUploading}>Asset Details</TabsTrigger>
            <TabsTrigger value="documents" disabled={isUploading}>Documentation</TabsTrigger>
            <TabsTrigger value="review" disabled={isUploading}>Review & Mint</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Information</CardTitle>
                <CardDescription>
                  Provide details about the real-world asset you want to tokenize
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assetName">Asset Name</Label>
                    <Input 
                      id="assetName" 
                      placeholder="e.g. Blue Chip Art Collection" 
                      value={assetName}
                      onChange={e => setAssetName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assetType">Asset Type</Label>
                    <Select value={assetType} onValueChange={setAssetType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSET_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Brief description of your asset" 
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longDescription">Detailed Description</Label>
                  <Textarea 
                    id="longDescription" 
                    placeholder="Provide a comprehensive description of your asset" 
                    rows={5}
                    value={longDescription}
                    onChange={e => setLongDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialPrice">Initial Valuation (USD)</Label>
                    <div className="relative">
                      <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="initialPrice" 
                        className="pl-10" 
                        placeholder="e.g. 100000" 
                        value={initialPrice}
                        onChange={e => setInitialPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Asset Location</Label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="location" 
                        className="pl-10" 
                        placeholder="e.g. Secure Storage, New York" 
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supply">Supply (Number of Tokens)</Label>
                  <Input 
                    id="supply" 
                    type="number" 
                    min="1"
                    placeholder="Default: 1" 
                    value={supply}
                    onChange={e => setSupply(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    For fractional ownership, you can increase the supply. Each token represents an equal share of the asset.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Asset Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative h-48 w-48 mx-auto overflow-hidden rounded-lg">
                          <Image 
                            src={imagePreview} 
                            alt="Asset preview" 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview(null)
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center py-4">
                          <ImagePlus className="h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground mb-1">Drag and drop or click to upload</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP up to 5MB</p>
                        </div>
                        <Input
                          type="file"
                          id="image"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('image')?.click()}
                        >
                          Select Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button onClick={() => setCurrentStep('documents')}>
                  Continue to Documentation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Documentation</CardTitle>
                <CardDescription>
                  Upload documentation to verify ownership and provenance of your asset
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Documentation Files</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center py-4">
                        <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground mb-1">Drag and drop or click to upload documents</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, or images up to 10MB</p>
                      </div>
                      <Input
                        type="file"
                        id="documents"
                        className="hidden"
                        accept=".pdf,.doc,.docx,image/*"
                        multiple
                        onChange={handleDocumentChange}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('documents')?.click()}
                      >
                        Select Documents
                      </Button>
                    </div>
                  </div>
                </div>
                
                {documents.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Documents</Label>
                    <div className="border border-border rounded-lg divide-y">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-primary mr-2" />
                            <span className="text-sm truncate max-w-[200px]">{doc.name}</span>
                            <Badge variant="outline" className="ml-2">{doc.type.split('/')[1]}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Required Documentation</h4>
                      <p className="text-sm text-muted-foreground">Proper documentation increases the confidence score of your asset</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 pl-7">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Proof of ownership</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Appraisal documents</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Certificates of authenticity</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Insurance certificates</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Historical provenance</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('details')}>
                  Back to Details
                </Button>
                <Button onClick={() => setCurrentStep('review')}>
                  Continue to Review
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="review" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Review & Mint</CardTitle>
                <CardDescription>
                  Review your asset details before minting it on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    {imagePreview ? (
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                        <Image 
                          src={imagePreview} 
                          alt="Asset preview" 
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center">
                        <ImagePlus className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="mt-4 space-y-2">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Documents Attached</p>
                        <p className="font-medium">{documents.length || 'None'}</p>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Token Supply</p>
                        <p className="font-medium">{supply}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">{assetName || 'Unnamed Asset'}</h3>
                      {assetType && (
                        <Badge className="mt-1">
                          {ASSET_TYPES.find(t => t.id === assetType)?.name || assetType}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Initial Valuation</p>
                        <p className="font-medium">${initialPrice ? parseFloat(initialPrice).toLocaleString() : '0'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{location || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p>{description || 'No description provided'}</p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <h4 className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Minting Process Information
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start">
                          <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                          <p>You&apos;ll be prompted to sign a transaction with your connected wallet</p>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                          <p>Asset metadata and documents will be uploaded to secure storage</p>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                          <p>RWAAssetContract will mint your token on the blockchain</p>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                          <p>Dynamic pricing will be initialized based on your valuation</p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm flex">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-yellow-600 dark:text-yellow-400">
                        By minting this asset, you certify that you are the rightful owner 
                        and have the legal right to tokenize it. Fraudulent submissions may 
                        be subject to legal action.
                      </p>
                    </div>
                  </div>
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Minting in progress</p>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {uploadProgress < 30 ? 'Preparing asset metadata...' : 
                       uploadProgress < 60 ? 'Uploading documentation to secure storage...' : 
                       uploadProgress < 90 ? 'Minting token on the blockchain...' : 
                       'Finalizing transaction...'}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('documents')} disabled={isUploading}>
                  Back to Documents
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isUploading || !isConnected}
                  className="min-w-[120px]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Minting
                    </>
                  ) : (
                    'Mint Asset'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 