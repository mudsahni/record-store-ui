import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes require authentication
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/admin',
    '/invoices',
    // Add any other protected routes here
];

// Define routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/register'];

// Define public routes that don't need any auth checks
const publicRoutes = ['/', '/about', '/contact', '/pricing'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies (more secure for SSR)
    const token = request.cookies.get('auth_token')?.value;

    console.log('🛡️ Middleware - Path:', pathname, 'Token exists:', !!token);

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if the current path is an auth route (login/register)
    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if it's a public route
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || (route === '/' && pathname === '/')
    );

    // Protect routes that require authentication
    if (isProtectedRoute && !token) {
        console.log('Redirecting to login - no token for protected route');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname); // Remember where they wanted to go
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && token) {
        console.log('Redirecting to dashboard - already authenticated');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow all other requests to continue
    return NextResponse.next();
}

// Configure which paths this middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};