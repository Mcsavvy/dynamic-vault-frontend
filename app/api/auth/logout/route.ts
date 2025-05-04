import { authService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/authMiddleware';
import connectToDatabase from '@/lib/database';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth<{ message: string } | { error: string }>(request, async (req) => {
    try {
      // Get the session ID from the token
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.substring(7) || '';
      const payload = authService.verifyToken(token);
      
      if (!payload || !payload.sessionId) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
      
      // Invalidate the session
      const success = await authService.logout(payload.sessionId);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to logout' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Endpoint to log out from all devices
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth<{ message: string } | { error: string }>(request, async (req) => {
    try {
      if (!req.user || !req.user.walletAddress) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }
      
      // Invalidate all sessions for the wallet address
      const success = await authService.logoutAll(req.user.walletAddress);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to logout from all devices' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ message: 'Logged out from all devices successfully' });
    } catch (error) {
      console.error('Error during logout all:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 