'use client'

import { AuthProvider } from '@/context/auth-context'
import { LanguageProvider } from '@/context/language-context'
import QueryProvider from '@/components/providers/query-provider'
import { NotificationProvider } from '@/context/notification-context'
import { ConnectivityProvider } from '@/context/connectivity-context'
import { OfflineSyncProvider } from '@/context/offline-sync-context'
import { ChatProvider } from '@/context/chat-context'
import { useEffect } from 'react'
import { FinancialClimateManager } from '@/components/financial-climate-manager'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => console.log('SW Registered'))
                .catch((err) => console.log('SW Registration failed', err))
        }
    }, [])

    return (
        <QueryProvider>
            <ConnectivityProvider>
                <LanguageProvider>
                    <NotificationProvider>
                        <OfflineSyncProvider>
                            <FinancialClimateManager />
                            <AuthProvider>
                                <ChatProvider>
                                    {children}
                                </ChatProvider>
                            </AuthProvider>
                        </OfflineSyncProvider>
                    </NotificationProvider>
                </LanguageProvider>
            </ConnectivityProvider>
        </QueryProvider>
    )
}
