'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SendInterviewForm from '@/components/layout/SendInterviewForm';

export default function InterviewPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        const userStr = sessionStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userRole = user?.role;
        if (!token) {
            router.push('/login');
            return;
        }
        if (userRole?.toLowerCase() !== 'admin' && userRole?.toLowerCase() !== 'hr') {
            router.push('/admin/dashboard');
            return;
        }
        setIsAuthenticated(true);
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
                <div className="animate-spin w-12 h-12 border-4 border-[var(--border-main)] border-t-blue-500 rounded-full"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[var(--bg-app)] p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-4 sm:mb-8">
                    <nav className="text-sm text-[var(--text-light)]">
                        <a href="/admin/dashboard" className="text-blue-500 hover:underline">Dashboard</a>
                        <span className="mx-2">/</span>
                        <a href="/admin/onboarding" className="text-blue-500 hover:underline">Onboarding</a>
                        <span className="mx-2">/</span>
                        <span className="text-[var(--text-main)] font-medium">Send Interview</span>
                    </nav>
                </div>
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] mb-2">Send Interview Invitation</h1>
                    <p className="text-[var(--text-light)]">Send online or offline interview invitations to candidates</p>
                </div>
                {/* Forms */}
                <SendInterviewForm />
            </div>
        </div>
    );
}