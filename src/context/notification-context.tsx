'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

export type NotificationType = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING' | 'CRITICAL'

export interface AppNotification {
    id: string
    type: NotificationType
    title: string
    message: string
    timestamp: string
    read: boolean
    actionUrl?: string
}

interface NotificationContextType {
    notifications: AppNotification[]
    lastAddedId: string | null
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
    markAsRead: (id: string) => void
    clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'appNotifications'

// Function to get initial notifications from localStorage
const getInitialNotifications = (): AppNotification[] => {
    if (typeof window !== 'undefined') {
        const storedNotifications = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (storedNotifications) {
            try {
                return JSON.parse(storedNotifications) as AppNotification[]
            } catch (e) {
                console.error("Failed to parse notifications from localStorage", e)
                return []
            }
        }
    }
    return []
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<AppNotification[]>(getInitialNotifications())
    const [lastAddedId, setLastAddedId] = useState<string | null>(null)

    // Effect to save notifications to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications))
        }
    }, [notifications])

    const addNotification = useCallback((params: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
        const id = Math.random().toString(36).substring(2, 11)
        const timestamp = new Date().toISOString()

        const newNotification: AppNotification = {
            ...params,
            id,
            timestamp,
            read: false,
        }

        setNotifications(prev => [newNotification, ...prev])
        setLastAddedId(id)
    }, [])

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    return (
        <NotificationContext.Provider value={{ notifications, lastAddedId, addNotification, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}
