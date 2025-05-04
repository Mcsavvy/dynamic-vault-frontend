import { userService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { validateQuery } from '@/lib/validators';
import { nonceRequestSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  // Validate query parameters
  const [queryData, validationError] = validateQuery(request, nonceRequestSchema);
  
  if (validationError) {
    return validationError;
  }

  // At this point, queryData is not null since validationError would be returned if it was
  if (!queryData) {
    return NextResponse.json(
      { error: 'Invalid wallet address' },
      { status: 400 }
    );
  }

  try {
    const { walletAddress } = queryData;
    
    // Generate a new nonce for the wallet address
    const nonce = await userService.generateNonce(walletAddress);
    
    // Return the nonce
    return NextResponse.json({ walletAddress, nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 