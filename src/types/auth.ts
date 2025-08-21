export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    emailVerified: boolean;
    status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
    roles: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Tenant {
    id: string;
    name: string;
    displayName?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token?: string;
    refreshToken?: string;
    user?: User;
    tenant?: Tenant;
    mustChangePassword?: boolean;
    error?: string;
}

export interface RegisterRequest {
    first_name: string;    // Note: using snake_case to match backend @JsonProperty
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
}

export interface RegistrationResponse {
    message?: string;
    error?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string; mustChangePassword?: boolean }>;
    logout: () => void;
    register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
    isAuthenticated: boolean;
    loading: boolean;
}