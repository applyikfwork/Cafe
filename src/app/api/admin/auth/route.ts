import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAuthTokenEdge } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.SESSION_SECRET;
    
    if (!adminPassword || !sessionSecret) {
      console.error('Admin authentication misconfigured:', {
        hasAdminPassword: !!adminPassword,
        hasSessionSecret: !!sessionSecret,
      });
      
      return NextResponse.json(
        {
          error: 'Admin authentication not configured. Please set ADMIN_PASSWORD and SESSION_SECRET environment variables.',
          debug: {
            hasAdminPassword: !!adminPassword,
            hasSessionSecret: !!sessionSecret,
          }
        },
        { status: 500 }
      );
    }
    
    if (password === adminPassword) {
      try {
        const cookieStore = await cookies();
        const authToken = await createAuthTokenEdge();
        
        cookieStore.set('admin_auth', authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
        
        return NextResponse.json({ success: true });
      } catch (tokenError) {
        console.error('Token creation error:', tokenError);
        return NextResponse.json(
          { error: 'Failed to create authentication token' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  return NextResponse.json({ success: true });
}
