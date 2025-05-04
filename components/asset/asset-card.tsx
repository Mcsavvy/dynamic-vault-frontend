import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import Link from "next/link"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

interface AssetCardProps {
    asset: {
        id: string
        name: string
        image: string
        currentPrice: number
        previousPrice: number
        percentChange: number
        aiConfidenceScore: number
    }
}

export function AssetCard({ asset }: AssetCardProps) {
    const isPriceUp = asset.percentChange >= 0

    // Determine confidence indicator color
    const getConfidenceColor = (score: number) => {
        if (score >= 80) return "bg-success-green"
        if (score >= 60) return "bg-yellow-500"
        return "bg-alert-red"
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Link href={`/asset/${asset.id}`}>
                <Card className="overflow-hidden border border-gray-200 shadow-card">
                    <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                            <ImageWithFallback
                                src={asset.image}
                                alt={asset.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-navy/80 to-transparent p-4">
                                <h3 className="text-xl font-semibold text-white">{asset.name}</h3>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate">Current Price</p>
                                <p className="text-xl font-bold text-deep-navy">{asset.currentPrice} ETH</p>
                            </div>
                            <div className={`flex items-center ${isPriceUp ? 'text-success-green' : 'text-alert-red'}`}>
                                {isPriceUp ? (
                                    <TrendingUp className="mr-1 h-4 w-4" />
                                ) : (
                                    <TrendingDown className="mr-1 h-4 w-4" />
                                )}
                                <span className="font-medium">{Math.abs(asset.percentChange).toFixed(2)}%</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-100 p-3 bg-light-gray">
                        <div className="flex items-center space-x-2">
                            <Badge className={`${getConfidenceColor(asset.aiConfidenceScore)} text-white`}>
                                AI Confidence: {asset.aiConfidenceScore}%
                            </Badge>
                            {asset.aiConfidenceScore < 60 && (
                                <AlertCircle className="h-4 w-4 text-alert-red" />
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    )
}