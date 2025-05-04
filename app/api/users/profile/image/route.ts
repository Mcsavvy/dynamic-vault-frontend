import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/authMiddleware';
import connectToDatabase from '@/lib/database';
import User from '@/lib/models/User';
import { uploadFileToS3, deleteFileFromS3 } from '@/lib/s3';
import crypto from 'crypto';

// Define response types
type SuccessResponse = { success: boolean; avatarUrl?: string; message?: string };
type ErrorResponse = { error: string };
type ResponseTypes = SuccessResponse | ErrorResponse;

// Upload profile image
export async function POST(request: NextRequest): Promise<NextResponse> {
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

      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 5MB.' },
          { status: 400 }
        );
      }

      // Format the file name
      const walletAddress = req.user.walletAddress.toLowerCase();
      const extension = file.name.split('.').pop() || '';
      const timestamp = Date.now();
      const newFileName = `user-uploads/${walletAddress}/profile/avatar_${timestamp}.${extension}`;

      try {
        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Upload to S3 with our new interface
        await uploadFileToS3({
          buffer,
          fileName: newFileName,
          contentType: file.type
        });
        
        // Delete previous profile image if exists
        const user = await User.findOne({ walletAddress });
        if (user?.profileInfo?.avatarUrl) {
          await deleteFileFromS3(user.profileInfo.avatarUrl).catch(err => {
            console.error(`Error deleting previous profile image: ${err}`);
          });
        }

        // Update user record with new image URL
        let updatedUser;
        
        if (user) {
          // If user exists, just update the avatar URL
          updatedUser = await User.findOneAndUpdate(
            { walletAddress },
            { $set: { 'profileInfo.avatarUrl': newFileName } },
            { new: true }
          );
        } else {
          // If user doesn't exist yet, create it with default values
          // Generate a random nonce and set expiry for 1 hour from now
          const nonce = crypto.randomBytes(32).toString('hex');
          const nonceExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
          
          updatedUser = await User.create({
            walletAddress,
            createdAt: new Date(),
            nonce,
            nonceExpiry,
            roles: ['user'],
            status: 'active',
            profileInfo: {
              avatarUrl: newFileName,
              notificationPreferences: {
                priceUpdates: true,
                transactions: true,
                marketEvents: true,
                emailNotifications: false
              }
            }
          });
        }

        if (!updatedUser) {
          return NextResponse.json(
            { error: 'Failed to update user profile' },
            { status: 500 }
          );
        }

        // Return the updated user profile
        return NextResponse.json({
          success: true,
          avatarUrl: newFileName
        });
      } catch (uploadError) {
        console.error('S3 upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image to storage' },
          { status: 500 }
        );
      }

    } catch (error) {
      console.error('Error uploading profile image:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Delete profile image
export async function DELETE(request: NextRequest): Promise<NextResponse> {
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

      const walletAddress = req.user.walletAddress;

      // Find user to get current avatar URL
      const user = await User.findOne({ walletAddress });
      if (!user || !user.profileInfo?.avatarUrl) {
        return NextResponse.json(
          { error: 'No profile image found' },
          { status: 404 }
        );
      }

      // Delete from S3
      await deleteFileFromS3(user.profileInfo.avatarUrl);

      // Update user record
      await User.updateOne(
        { walletAddress },
        { $unset: { 'profileInfo.avatarUrl': "" } }
      );

      return NextResponse.json({
        success: true,
        message: 'Profile image deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting profile image:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 