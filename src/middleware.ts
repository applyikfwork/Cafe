import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-utils';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin')) {
    const authToken = request.cookies.get('admin_auth')?.value;
    const isAuthenticated = authToken ? verifyAuthToken(authToken) : false;
    
    if (!isAuthenticated && path !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    if (isAuthenticated && path === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
