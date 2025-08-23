'use client';

import { useAuth } from './AuthProvider';
import { useEffect } from 'react';
import { AuthCookies } from '@/lib/auth-cookies';

interface AuthWrapperProps {
    children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
    const { token, logout } = useAuth();

    // Sync token with cookies for middleware
    useEffect(() => {
        if (token) {
            // Set cookie when we have a token
            document.cookie = AuthCookies.setAuthCookie(token);
        } else {
            // Clear cookie when we don't have a token
            document.cookie = AuthCookies.clearAuthCookie();
        }
    }, [token]);

    // Clear cookies on logout
    useEffect(() => {
        const originalLogout = logout;
        const enhancedLogout = () => {
            document.cookie = AuthCookies.clearAuthCookie();
            originalLogout();
        };

        // You might need to update your AuthProvider to use this enhanced logout
    }, [logout]);

    return <>{children}</>;
};
