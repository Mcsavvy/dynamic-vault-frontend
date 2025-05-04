import { authService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { validateBody } from '@/lib/validators';
import { verifySignatureSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  // Validate request body
  const [bodyData, validationError] = await validateBody(request, verifySignatureSchema);
  
  if (validationError) {
    return validationError;
  }

  if (!bodyData) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }

  try {
    const { walletAddress, signature, message } = bodyData;
    
    // Verify the signature
    const signatureIsValid = authService.verifySignature(message, signature, walletAddress);
    
    if (!signatureIsValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Get user IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip;
    const userAgent = request.headers.get('user-agent');
    
    // Create session and generate tokens
    const { token: accessToken, refreshToken } = await authService.createSession(
      walletAddress, 
      ipAddress as string, 
      userAgent as string
    );
    
    // Return the tokens
    return NextResponse.json({
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRY || '15m'
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 