import { authService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { validateBody } from '@/lib/validators';
import { refreshTokenSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  // Validate request body
  const [bodyData, validationError] = await validateBody(request, refreshTokenSchema);
  
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
    const { refreshToken } = bodyData;
    
    // Attempt to refresh the token
    const result = await authService.refreshToken(refreshToken);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }
    
    // Return the new access token
    return NextResponse.json({
      accessToken: result.token,
      expiresIn: process.env.JWT_EXPIRY || '15m'
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 