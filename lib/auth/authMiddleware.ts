import { authService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    walletAddress: string;
    id: string;
    roles: string[];
  };
}

/**
 * Middleware that verifies JWT token and attaches user info to the request
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<[AuthenticatedRequest, NextResponse | null]> {
  const req = request as AuthenticatedRequest;
  
  // Get authorization header
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return [req, NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 })];
  }
  
  // Extract token
  const token = authHeader.substring(7);
  
  // Verify token
  const payload = authService.verifyToken(token);
  
  if (!payload) {
    return [req, NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 })];
  }
  
  // Get user from database to ensure they still exist and have proper permissions
  const user = await User.findOne({ walletAddress: payload.walletAddress });
  
  if (!user) {
    return [req, NextResponse.json({ error: 'Unauthorized - User not found' }, { status: 401 })];
  }
  
  // Attach user info to request
  req.user = {
    walletAddress: user.walletAddress,
    id: user._id.toString(),
    roles: user.roles
  };
  
  return [req, null];
}

/**
 * Middleware that verifies user has required roles
 */
export function requireRoles(req: AuthenticatedRequest, roles: string[]): NextResponse | null {
  if (!req.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const hasRequiredRole = req.user.roles.some(role => roles.includes(role));
  
  if (!hasRequiredRole) {
    return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 });
  }
  
  return null;
}

/**
 * Helper function for protected API routes with typed responses
 */
export async function withAuth<T>(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse<T> | NextResponse>,
  requiredRoles: string[] = []
): Promise<NextResponse> {
  // Authenticate the request
  const [req, authError] = await authenticateRequest(request);
  
  if (authError) {
    return authError;
  }
  
  // Check roles if specified
  if (requiredRoles.length > 0) {
    const roleError = requireRoles(req, requiredRoles);
    if (roleError) {
      return roleError;
    }
  }
  
  // Process the request with the authenticated user
  return handler(req);
}

/**
 * Helper function for protected API routes without type restrictions
 * Use this when the response type varies or is complex to type
 */
export async function withAuthAny(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  requiredRoles: string[] = []
): Promise<NextResponse> {
  // Authenticate the request
  const [req, authError] = await authenticateRequest(request);
  
  if (authError) {
    return authError;
  }
  
  // Check roles if specified
  if (requiredRoles.length > 0) {
    const roleError = requireRoles(req, requiredRoles);
    if (roleError) {
      return roleError;
    }
  }
  
  // Process the request with the authenticated user
  return handler(req);
} 