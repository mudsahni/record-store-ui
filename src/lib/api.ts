// src/lib/api.ts
import {LoginRequest, LoginResponse, RegisterRequest, RegistrationResponse, User} from '@/types/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export class ApiService {
    private static async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                error: `HTTP error! status: ${response.status}`
            }));
            throw new Error(error.error || error.message || 'Request failed');
        }

        return response.json();
    }

    // Login to your Spring Boot backend
    static async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            return await this.request<LoginResponse>('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });
        } catch (error) {
            // Return error in the format your backend sends
            return {
                error: error instanceof Error ? error.message : 'Login failed'
            };
        }
    }

    static async register(userData: RegisterRequest): Promise<RegistrationResponse> {
        try {
            return await this.request<RegistrationResponse>('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Registration failed'
            };
        }
    }

    // Verify token using the /me endpoint
    static async getCurrentUser(token: string): Promise<User> {
        return this.request<User>('/auth/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Verify if token is still valid
    static async verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
        try {
            const user = await this.getCurrentUser(token);
            return { valid: true, user };
        } catch {
            return { valid: false };
        }
    }

    static async verifyEmail(token: string): Promise<RegistrationResponse> {
        try {
            return await this.request<RegistrationResponse>(`/auth/verify?token=${encodeURIComponent(token)}`, {
                method: 'GET',
            });
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Email verification failed'
            };
        }
    }

    // Resend verification email
    static async resendVerification(email: string): Promise<RegistrationResponse> {
        try {
            return await this.request<RegistrationResponse>(`/auth/resend?email=${encodeURIComponent(email)}`, {
                method: 'POST',
            });
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Failed to resend verification email'
            };
        }
    }
}