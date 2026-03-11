'use client'

import { QueryClient, QueryClientProvider, dehydrate, hydrate } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { get, set } from 'idb-keyval'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                gcTime: 1000 * 60 * 60 * 24, // 24 hours
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    }))

    // Manual persistence since we already have idb-keyval
    useEffect(() => {
        const loadCache = async () => {
            try {
                const savedState = await get('serendipity-query-cache')
                if (savedState) {
                    hydrate(queryClient, savedState)
                }
            } catch (err) {
                console.error('Failed to restore offline cache', err)
            }
        }

        loadCache()

        // Persist on changes (throttled)
        const unsubscribe = queryClient.getQueryCache().subscribe(() => {
            const state = dehydrate(queryClient)
            set('serendipity-query-cache', state)
        })

        return () => unsubscribe()
    }, [queryClient])

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
