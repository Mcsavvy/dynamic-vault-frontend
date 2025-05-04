import { userService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { userProfileUpdateSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';

// Define a type for the user profile response
type UserProfile = {
  walletAddress: string;
  roles: string[];
  createdAt: Date;
  lastLogin?: Date;
  profileInfo?: {
    username?: string;
    email?: string;
    avatarUrl?: string;
    notificationPreferences?: {
      priceUpdates: boolean;
      transactions: boolean;
      marketEvents: boolean;
      emailNotifications: boolean;
    };
  };
  status: string;
};

// Define response types
type SuccessResponse = { success: boolean };
type ErrorResponse = { error: string };
type UserResponse = { user: UserProfile };
type ResponseTypes = SuccessResponse | ErrorResponse | UserResponse;

// Get user profile
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth<ResponseTypes>(request, async (req) => {
    try {
      if (!req.user || !req.user.walletAddress) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }
      
      // Get user profile
      const user = await userService.findByWalletAddress(req.user.walletAddress);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Return safe user data
      return NextResponse.json({
        user: {
          walletAddress: user.walletAddress,
          roles: user.roles,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          profileInfo: user.profileInfo,
          status: user.status
        }
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Update user profile - using PUT instead of PATCH for compatibility
export async function PUT(request: NextRequest): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuth<ResponseTypes>(request, async (req) => {
    // Validate request body
    const [bodyData, validationError] = await validateBody(request, userProfileUpdateSchema);
    
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
      if (!req.user || !req.user.walletAddress) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }
      
      // Convert the validated data appropriately
      const profileUpdate = {
        username: bodyData.username,
        email: bodyData.email,
        avatarUrl: bodyData.avatarUrl,
        notificationPreferences: bodyData.notificationPreferences
          ? {
              priceUpdates: bodyData.notificationPreferences.priceUpdates ?? true,
              transactions: bodyData.notificationPreferences.transactions ?? true,
              marketEvents: bodyData.notificationPreferences.marketEvents ?? true,
              emailNotifications: bodyData.notificationPreferences.emailNotifications ?? false,
            }
          : undefined
      };
      
      // Update user profile
      const updatedUser = await userService.updateProfile(req.user.walletAddress, profileUpdate);
      
      if (!updatedUser) {
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }
      
      // Return the updated user profile
      return NextResponse.json({
        user: {
          walletAddress: updatedUser.walletAddress,
          roles: updatedUser.roles,
          createdAt: updatedUser.createdAt,
          lastLogin: updatedUser.lastLogin,
          profileInfo: updatedUser.profileInfo,
          status: updatedUser.status
        }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// For backward compatibility, maintain the PATCH method
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return PUT(request);
} 