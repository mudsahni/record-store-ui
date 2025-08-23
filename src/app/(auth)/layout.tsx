import { AuthLayout } from '@/components/auth/AuthLayout'

export default function AuthLayoutContainer({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    )
}
