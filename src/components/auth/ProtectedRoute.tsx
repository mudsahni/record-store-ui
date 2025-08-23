'use client';

import {useAuth} from './AuthProvider';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const ProtectedRoute = ({children, fallback}: ProtectedRouteProps) => {
    const {isAuthenticated, loading} = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Get current path to redirect back after login
            const currentPath = window.location.pathname;
            const loginUrl = `/login${currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''}`;
            router.push(loginUrl);
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return fallback || (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return fallback || null; // Will redirect in useEffect
    }

    return <>{children}</>;
};
