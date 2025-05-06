import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is for the admin panel
  if (path.startsWith('/admin')) {
    const session = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Redirect to login if not authenticated
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    // Redirect to home if not an admin
    if (session.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
