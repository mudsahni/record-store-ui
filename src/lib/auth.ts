// src/lib/auth.ts
import {LoginRequest, LoginResponse, User, Tenant, RegisterRequest} from '@/types/auth';
import { ApiService } from './api';

export class AuthService {
    private static readonly TOKEN_KEY = 'auth_token';
    private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private static readonly USER_KEY = 'auth_user';
    private static readonly TENANT_KEY = 'auth_tenant';

    // Get stored token from localStorage
    static getStoredToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // Get stored user from localStorage
    static getStoredUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    // Get stored tenant from localStorage
    static getStoredTenant(): Tenant | null {
        if (typeof window === 'undefined') return null;
        const tenantData = localStorage.getItem(this.TENANT_KEY);
        return tenantData ? JSON.parse(tenantData) : null;
    }

    // Store auth data after successful login
    static setAuth(loginResponse: LoginResponse): void {
        if (loginResponse.token) {
            localStorage.setItem(this.TOKEN_KEY, loginResponse.token);
        }
        if (loginResponse.refreshToken) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, loginResponse.refreshToken);
        }
        if (loginResponse.user) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(loginResponse.user));
        }
        if (loginResponse.tenant) {
            localStorage.setItem(this.TENANT_KEY, JSON.stringify(loginResponse.tenant));
        }
    }

    // Clear all auth data
    static clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TENANT_KEY);
    }

    // Login function that matches your backend response
    static async login(credentials: LoginRequest): Promise<{
        success: boolean;
        error?: string;
        mustChangePassword?: boolean;
        data?: LoginResponse
    }> {
        try {
            const response = await ApiService.login(credentials);

            // Check if login failed (your backend returns error in response)
            if (response.error) {
                return {
                    success: false,
                    error: response.error
                };
            }

            // Login successful - store the auth data
            this.setAuth(response);

            return {
                success: true,
                data: response,
                mustChangePassword: response.mustChangePassword
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Login failed'
            };
        }
    }


    static async register(userData: RegisterRequest): Promise<{
        success: boolean;
        error?: string;
        message?: string;
    }> {
        try {
            console.log('📝 Registering user:', userData);
            const response = await ApiService.register(userData);

            // Check if registration failed
            if (response.error) {
                console.log('❌ Registration failed:', response.error);
                return {
                    success: false,
                    error: response.error
                };
            }

            // Registration successful
            console.log('✅ Registration successful:', response.message);
            return {
                success: true,
                message: response.message
            };
        } catch (error) {
            console.log('❌ Registration error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Registration failed'
            };
        }
    }
    // Verify stored token is still valid
    static async verifyStoredToken(): Promise<{
        valid: boolean;
        user?: User
    }> {
        const token = this.getStoredToken();
        if (!token) return { valid: false };

        try {
            const result = await ApiService.verifyToken(token);
            if (result.valid && result.user) {
                // Update stored user data with fresh data
                localStorage.setItem(this.USER_KEY, JSON.stringify(result.user));
            }
            return result;
        } catch {
            this.clearAuth();
            return { valid: false };
        }
    }
}