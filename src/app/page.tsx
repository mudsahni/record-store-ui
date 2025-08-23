'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export default function HomePage() {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-950 dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-semibold text-zinc-900 dark:text-white">
                                Catalyst App
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/about" className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                                About
                            </Link>
                            <Link href="/pricing" className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                                Pricing
                            </Link>

                            {isAuthenticated ? (
                                <>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    Welcome, {user?.firstName}
                  </span>
                                    <Link
                                        href="/dashboard"
                                        className="bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-2 rounded-md text-sm font-medium dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-zinc-700 hover:text-zinc-900 px-3 py-2 rounded-md text-sm font-medium dark:text-zinc-300 dark:hover:text-white"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-2 rounded-md text-sm font-medium dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-6">
                        Welcome to Catalyst
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8">
                        {isAuthenticated
                            ? `Hello ${user?.firstName}! You are logged in.`
                            : 'This is a public page accessible to everyone.'
                        }
                    </p>

                    {!isAuthenticated && (
                        <div className="space-x-4">
                            <Link
                                href="/register"
                                className="bg-zinc-950 hover:bg-zinc-800 text-white px-6 py-3 rounded-md font-medium inline-block dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/login"
                                className="border border-zinc-300 hover:border-zinc-400 text-zinc-700 px-6 py-3 rounded-md font-medium inline-block dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-500"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}