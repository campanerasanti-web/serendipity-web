'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { get, set, del } from 'idb-keyval'
import { useConnectivity } from './connectivity-context'
import { OperationsService } from '@/services/operations.service'
import { useNotifications } from './notification-context'
import { useTranslation } from './language-context'
import { useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react'

// Map of services to make them accessible via string keys
const SERVICES_MAP: Record<string, any> = {
    OperationsService
}

export interface PendingAction {
    id: string
    service: string
    method: string
    args: any[]
    timestamp: number
    label: string // For user feedback
}

interface OfflineSyncContextType {
    isSyncing: boolean
    queueLength: number
    enqueueAction: (action: Omit<PendingAction, 'id' | 'timestamp'>) => Promise<void>
}

const OfflineSyncContext = createContext<OfflineSyncContextType>({
    isSyncing: false,
    queueLength: 0,
    enqueueAction: async () => {}
})

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
    const { isOnline } = useConnectivity()
    const { addNotification } = useNotifications()
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const [queue, setQueue] = useState<PendingAction[]>([])
    const [isSyncing, setIsSyncing] = useState(false)
    const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 })

    // Load queue on mount
    useEffect(() => {
        const loadQueue = async () => {
            const savedQueue = await get<PendingAction[]>('offline-mutation-queue')
            if (savedQueue) setQueue(savedQueue)
        }
        loadQueue()
    }, [])

    // Save queue whenever it changes
    useEffect(() => {
        set('offline-mutation-queue', queue)
    }, [queue])

    const processQueue = useCallback(async () => {
        if (queue.length === 0 || isSyncing || !isOnline) return

        setIsSyncing(true)
        setSyncProgress({ current: 0, total: queue.length })
        
        const currentQueue = [...queue]
        const remainingQueue: PendingAction[] = []
        let successCount = 0

        for (const action of currentQueue) {
            try {
                const service = SERVICES_MAP[action.service]
                if (service && typeof service[action.method] === 'function') {
                    await service[action.method](...action.args)
                    successCount++
                } else {
                    console.error(`Service or method not found: ${action.service}.${action.method}`)
                }
            } catch (error) {
                console.error(`Sync failed for action ${action.id}:`, error)
                remainingQueue.push(action)
            }
            setSyncProgress(prev => ({ ...prev, current: prev.current + 1 }))
        }

        setQueue(remainingQueue)
        setIsSyncing(false)

        if (successCount > 0) {
            // Refresh all relevant queries
            queryClient.invalidateQueries()
            
            addNotification({
                type: 'SUCCESS',
                title: t('common.syncCompletedTitle'),
                message: t('common.syncCompletedMessage', { count: successCount })
            })
        }

        if (remainingQueue.length > 0) {
            addNotification({
                type: 'ERROR',
                title: t('common.partialFailureTitle'),
                message: t('common.partialFailureMessage', { count: remainingQueue.length })
            })
        }
    }, [queue, isOnline, isSyncing, addNotification, queryClient, t])

    // Trigger sync when coming back online
    useEffect(() => {
        if (isOnline && queue.length > 0) {
            processQueue()
        }
    }, [isOnline, queue.length, processQueue])

    const enqueueAction = async (actionData: Omit<PendingAction, 'id' | 'timestamp'>) => {
        const newAction: PendingAction = {
            ...actionData,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
        }

        if (isOnline) {
            // If online, try to execute immediately
            try {
                const service = SERVICES_MAP[newAction.service]
                await service[newAction.method](...newAction.args)
                queryClient.invalidateQueries()
                return
            } catch (err) {
                console.warn('Direct execution failed, enqueuing for later', err)
            }
        }

        setQueue(prev => [...prev, newAction])
        addNotification({
            type: 'INFO',
            title: t('common.offlineSavedTitle'),
            message: t('common.offlineSavedMessage', { label: actionData.label })
        })
    }

    return (
        <OfflineSyncContext.Provider value={{ isSyncing, queueLength: queue.length, enqueueAction }}>
            {children}
            
            {/* Sync Status Overlay */}
            <AnimatePresence>
                {isSyncing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed top-24 right-6 z-[100]"
                    >
                        <div className="bg-[var(--card)]/80 backdrop-blur-xl border border-blue-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[240px]">
                            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
                                <RefreshCcw size={20} className="animate-spin" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">{t('common.syncRitual')}</p>
                                <p className="text-sm font-bold text-[var(--foreground)]">{t('common.processing')} {syncProgress.current} / {syncProgress.total}</p>
                                <div className="w-full h-1 bg-[var(--secondary)] rounded-full mt-2 overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-blue-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </OfflineSyncContext.Provider>
    )
}

export const useOfflineSync = () => useContext(OfflineSyncContext)
