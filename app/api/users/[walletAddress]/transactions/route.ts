import { transactionService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/database';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { walletAddress: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  try {
    const { walletAddress } = params;
    
    // Validate wallet address format
    if (!walletAddress || !walletAddress.startsWith('0x')) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const page = parseInt(url.searchParams.get('page') || '1');
    const startDateParam = url.searchParams.get('startDate');
    const endDateParam = url.searchParams.get('endDate');
    
    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;
    
    // Validate dates
    if (startDateParam && isNaN(startDate?.getTime() || NaN)) {
      return NextResponse.json(
        { error: 'Invalid start date format' },
        { status: 400 }
      );
    }
    
    if (endDateParam && isNaN(endDate?.getTime() || NaN)) {
      return NextResponse.json(
        { error: 'Invalid end date format' },
        { status: 400 }
      );
    }

    // Get transactions by user
    const userTransactions = await transactionService.getTransactions({
      buyer: walletAddress,
      seller: walletAddress,
      startDate,
      endDate,
      page,
      limit
    });

    // Format the response
    const formattedTransactions = userTransactions.transactions.map(tx => ({
      id: tx._id.toString(),
      type: tx.type,
      tokenId: tx.tokenId,
      asset: tx.assetId ? {
        id: typeof tx.assetId === 'string' ? tx.assetId : tx.assetId.toString(),
        name: tx.assetId && 
              typeof tx.assetId !== 'string' && 
              !mongoose.isObjectIdOrHexString(tx.assetId) && 
              'name' in tx.assetId ? 
                tx.assetId.name : 
                undefined
      } : undefined,
      price: tx.price,
      priceUsd: tx.priceUsd,
      isBuyer: tx.buyer?.toLowerCase() === walletAddress.toLowerCase(),
      isSeller: tx.seller?.toLowerCase() === walletAddress.toLowerCase(),
      counterparty: tx.buyer?.toLowerCase() === walletAddress.toLowerCase() ? tx.seller : tx.buyer,
      timestamp: tx.timestamp,
      status: tx.status
    }));

    return NextResponse.json({
      transactions: formattedTransactions,
      pagination: {
        total: userTransactions.total,
        page: userTransactions.page,
        totalPages: userTransactions.totalPages
      }
    });
  } catch (error) {
    console.error(`Error fetching transactions for wallet ${params.walletAddress}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 