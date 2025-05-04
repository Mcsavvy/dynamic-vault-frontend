import { transactionService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { validateQuery } from '@/lib/validators';
import { transactionQuerySchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

// Get all transactions with filtering
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  // Validate query parameters
  const [queryParams, validationError] = validateQuery(request, transactionQuerySchema);
  
  if (validationError) {
    return validationError;
  }

  if (!queryParams) {
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 }
    );
  }

  try {
    // Get transactions with filtering options
    const { 
      transactions, 
      total, 
      page, 
      totalPages 
    } = await transactionService.getTransactions(queryParams);

    // Transform transactions to return only necessary data
    const transactionList = transactions.map(tx => ({
      id: tx._id.toString(),
      type: tx.type,
      tokenId: tx.tokenId,
      asset: tx.assetId ? {
        id: typeof tx.assetId === 'string' ? tx.assetId : tx.assetId.toString(),
        // @ts-expect-error ...
        name: typeof tx.assetId === 'object' ? tx.assetId.name : undefined
      } : undefined,
      price: tx.price,
      priceUsd: tx.priceUsd,
      seller: tx.seller,
      buyer: tx.buyer,
      timestamp: tx.timestamp,
      status: tx.status,
      blockchain: tx.blockchain
    }));

    return NextResponse.json({
      transactions: transactionList,
      pagination: {
        total,
        page,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 