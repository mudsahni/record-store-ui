// src/components/auth/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {AuthContextType, User, LoginRequest, RegisterRequest} from '@/types/auth';
import { AuthService } from '@/lib/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('Initializing auth...');

            // Check if we have stored auth data
            const storedToken = AuthService.getStoredToken();
            const storedUser = AuthService.getStoredUser();

            if (storedToken && storedUser) {
                console.log('Found stored auth data, verifying...');

                // Verify the token is still valid
                const verificationResult = await AuthService.verifyStoredToken();

                if (verificationResult.valid && verificationResult.user) {
                    console.log('Token verification successful');
                    setToken(storedToken);
                    setUser(verificationResult.user);
                } else {
                    console.log('Token verification failed, clearing auth data');
                    AuthService.clearAuth();
                }
            } else {
                console.log('No stored auth data found');
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        console.log('Attempting login for:', credentials.email);

        const result = await AuthService.login(credentials);

        if (result.success && result.data) {
            console.log('Login successful');
            setToken(result.data.token || null);
            setUser(result.data.user || null);

            return {
                success: true,
                mustChangePassword: result.mustChangePassword
            };
        } else {
            console.log('Login failed:', result.error);
            return {
                success: false,
                error: result.error
            };
        }
    };

    const register = async (userData: RegisterRequest) => {
        console.log('📝 Attempting registration for:', userData.email);
        console.log('🌍 Using API URL:', process.env.NEXT_PUBLIC_API_URL);

        const result = await AuthService.register(userData);

        console.log('📤 Registration result:', { success: result.success, error: result.error, message: result.message });

        return {
            success: result.success,
            error: result.error
        };
    };

    const logout = () => {
        console.log('Logging out...');
        AuthService.clearAuth();
        setUser(null);
        setToken(null);
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        register,
        isAuthenticated: !!user && !!token,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

