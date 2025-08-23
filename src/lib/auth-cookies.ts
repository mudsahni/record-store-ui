// src/lib/auth-cookies.ts (Fixed version)
export class AuthCookies {
    // Set auth cookie (call this after successful login)
    // Note: Removed HttpOnly so JavaScript can access it for middleware
    static setAuthCookie(token: string, maxAge = 60 * 60 * 24 * 7): string {
        // For localhost development
        if (process.env.NODE_ENV === 'development') {
            return `auth_token=${token}; Max-Age=${maxAge}; Path=/; SameSite=Strict`;
        }
        // For production (keep Secure for HTTPS)
        return `auth_token=${token}; Max-Age=${maxAge}; Path=/; Secure; SameSite=Strict`;
    }

    // Clear auth cookie (call this on logout)
    static clearAuthCookie(): string {
        // For localhost development
        if (process.env.NODE_ENV === 'development') {
            return 'auth_token=; Max-Age=0; Path=/; SameSite=Strict';
        }
        // For production
        return 'auth_token=; Max-Age=0; Path=/; Secure; SameSite=Strict';
    }

    // Get token from cookie string
    static getTokenFromCookies(cookieString: string): string | null {
        if (!cookieString) return null;

        const cookies = cookieString.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, string>);

        return cookies['auth_token'] || null;
    }

    // Helper method to get token from browser cookies
    static getTokenFromBrowser(): string | null {
        if (typeof window === 'undefined') return null;
        return this.getTokenFromCookies(document.cookie);
    }
}