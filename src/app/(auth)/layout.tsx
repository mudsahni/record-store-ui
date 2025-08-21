import { AuthProvider } from '@/components/auth/AuthProvider'
import { AuthLayout } from '@/components/auth/auth-layout'
import type { Metadata } from 'next'


export default function AuthLayoutWithProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AuthLayout>
                {children}
            </AuthLayout>
        </AuthProvider>
    )
}