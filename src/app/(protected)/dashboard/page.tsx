'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Dashboard() {
    const { user, logout } = useAuth();
    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                {/* Navigation */}
                <nav className="bg-white shadow-sm border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Dashboard</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                            Welcome to your Dashboard!
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-lg">
                                <h3 className="font-medium text-zinc-900 dark:text-white">Profile</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                                    Email: {user?.email}
                                </p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                    Status: <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    user?.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                }`}>
                    {user?.status}
                  </span>
                                </p>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-lg">
                                <h3 className="font-medium text-zinc-900 dark:text-white">Email Verification</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                                    {user?.emailVerified ? 'Verified ✅' : 'Not verified ❌'}
                                </p>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-lg">
                                <h3 className="font-medium text-zinc-900 dark:text-white">Phone</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                                    {user?.phoneNumber || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}