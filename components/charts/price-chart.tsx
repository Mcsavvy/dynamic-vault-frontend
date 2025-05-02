import { useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Price history data type
interface PricePoint {
    timestamp: number
    price: number
    source: string
    confidence: number
}

interface PriceChartProps {
    priceHistory: PricePoint[]
    title?: string
}

export function PriceChart({ priceHistory, title = "Price History" }: PriceChartProps) {
    const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month')

    // Format data according to the selected timeframe
    const getFilteredData = () => {
        const now = Date.now()
        let threshold: number

        switch (timeframe) {
            case 'day':
                threshold = now - 24 * 60 * 60 * 1000 // 24 hours
                break
            case 'week':
                threshold = now - 7 * 24 * 60 * 60 * 1000 // 7 days
                break
            case 'month':
                threshold = now - 30 * 24 * 60 * 60 * 1000 // 30 days
                break
            case 'year':
                threshold = now - 365 * 24 * 60 * 60 * 1000 // 365 days
                break
            default:
                threshold = now - 30 * 24 * 60 * 60 * 1000 // Default to month
        }

        return priceHistory
            .filter(point => point.timestamp > threshold)
            .map(point => ({
                ...point,
                date: new Date(point.timestamp).toLocaleDateString(),
                formattedTime: new Date(point.timestamp).toLocaleTimeString(),
            }))
    }

    const filteredData = getFilteredData()

    const formatTooltipDate = (timestamp: number) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-deep-navy">{title}</CardTitle>
                <Tabs defaultValue="month" onValueChange={(value) => setTimeframe(value as 'day' | 'week' | 'month' | 'year')}>
                    <TabsList className="grid w-full grid-cols-4 bg-light-gray">
                        <TabsTrigger value="day">24h</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={filteredData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) => {
                                    const date = new Date(timestamp)
                                    return timeframe === 'day'
                                        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : date.toLocaleDateString()
                                }}
                                stroke="#6B7A8F"
                            />
                            <YAxis stroke="#6B7A8F" />
                            <Tooltip
                                labelFormatter={(timestamp) => formatTooltipDate(timestamp)}
                                contentStyle={{ background: '#fff', borderColor: '#e0e0e0' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#2A6A9A"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                                name="Price (ETH)"
                            />
                            <Line
                                type="monotone"
                                dataKey="confidence"
                                stroke="#3ECFB2"
                                strokeWidth={2}
                                name="AI Confidence (%)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}