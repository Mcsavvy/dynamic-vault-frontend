import { authService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/authMiddleware';
import connectToDatabase from '@/lib/database';

// Define a type for the safe session object
type SafeSession = {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isCurrentSession: boolean;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth<{ sessions: SafeSession[] } | { error: string }>(request, async (req) => {
    try {
      if (!req.user || !req.user.walletAddress) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }
      
      // Get active sessions for the user
      const sessions = await authService.getActiveSessions(req.user.walletAddress);
      
      // Transform sessions to remove sensitive information
      const safeSessions = sessions.map(session => ({
        id: session._id.toString(),
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        isCurrentSession: session._id.toString() === req.user?.id
      }));
      
      return NextResponse.json({ sessions: safeSessions });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 