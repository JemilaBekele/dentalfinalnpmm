import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function authMiddleware(request: NextRequest, requiredRole?: string) {
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  if (requiredRole && token.role !== requiredRole) {
    return NextResponse.json({ message: `Forbidden: Requires ${requiredRole} role` }, { status: 403 });
  }

  // Log token for debugging
  console.log("Token Data:", token);

  (request as any).user = {
    id: token.id,
    username: token.username,
    role: token.role,
  };

  return null;
}

export async function authorizedMiddleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

 
  return null;
}