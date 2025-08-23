import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            {children}
        </div>
    )
}