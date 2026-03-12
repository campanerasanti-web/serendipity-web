'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications, NotificationType } from '@/context/notification-context'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

const ICON_MAP: Record<NotificationType, any> = {
    SUCCESS: CheckCircle2,
    ERROR: XCircle,
    WARNING: AlertCircle,
    INFO: Info,
    CRITICAL: AlertCircle
}

const COLOR_MAP: Record<NotificationType, string> = {
    SUCCESS: 'bg-[var(--secondary)]/90 border-emerald-500/50 text-[var(--foreground)] backdrop-blur-md',
    ERROR: 'bg-[var(--secondary)]/90 border-red-500/50 text-[var(--foreground)] backdrop-blur-md',
    WARNING: 'bg-[var(--secondary)]/90 border-amber-500/50 text-[var(--foreground)] backdrop-blur-md',
    INFO: 'bg-[var(--secondary)]/90 border-blue-500/50 text-[var(--foreground)] backdrop-blur-md',
    CRITICAL: 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-500/40'
}

const ICON_COLOR_MAP: Record<NotificationType, string> = {
    SUCCESS: 'text-emerald-500',
    ERROR: 'text-red-500',
    WARNING: 'text-amber-500',
    INFO: 'text-blue-500',
    CRITICAL: 'text-white'
}

export function ToastContainer() {
    const { notifications, markAsRead } = useNotifications()
    const [visibleNotifications, setVisibleNotifications] = useState<string[]>([])
    const processedIds = React.useRef<Set<string>>(new Set())

    useEffect(() => {
        // Identify new unread notifications that haven't been shown yet
        const newNotifications = notifications.filter(n => !n.read && !processedIds.current.has(n.id))
        
        if (newNotifications.length > 0) {
            newNotifications.forEach(n => {
                processedIds.current.add(n.id)

                // Define MFA keywords to silence as toasts (but keep in history)
                const mfaKeywords = ['Ritual', 'Sincronía Iniciada', 'Sync Ritual', 'Verificación'];
                const isMfaToast = mfaKeywords.some(kw => n.title.includes(kw) || n.message.includes(kw));

                if (isMfaToast) {
                    markAsRead(n.id)
                    return
                }

                // Add to visible display
                setVisibleNotifications(prev => [...prev, n.id])
                
                // Set independent timer for each toast
                setTimeout(() => {
                    setVisibleNotifications(prev => prev.filter(id => id !== n.id))
                    markAsRead(n.id)
                }, 5000)
            })
        }
    }, [notifications, markAsRead])

    const activeNotifications = notifications.filter(n => visibleNotifications.includes(n.id))

    return (
        <div className="fixed top-2 sm:top-24 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[200] flex flex-col gap-2 w-full px-4 sm:px-0 sm:max-w-[320px] pointer-events-none items-center sm:items-end">
            <AnimatePresence>
                {activeNotifications.map((n) => {
                    const Icon = ICON_MAP[n.type]
                    return (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={cn(
                                "pointer-events-auto relative overflow-hidden rounded-2xl border shadow-xl flex items-center gap-3 p-3 w-full transition-all",
                                COLOR_MAP[n.type]
                            )}
                        >
                            <div className={cn("shrink-0 p-2 rounded-full", n.type === 'CRITICAL' ? "bg-white/20" : "bg-[var(--background)]/50", ICON_COLOR_MAP[n.type])}>
                                <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[11px] font-bold uppercase tracking-wider truncate leading-none mb-1">{n.title}</h4>
                                {n.message && <p className="text-[10px] opacity-70 truncate font-medium">{n.message}</p>}
                            </div>
                            <button 
                                onClick={() => setVisibleNotifications(prev => prev.filter(id => id !== n.id))}
                                className="shrink-0 opacity-40 hover:opacity-100 transition-opacity p-1 mr-1"
                            >
                                <X size={14} />
                            </button>
                            
                            {/* Discrete progress bar */}
                            <motion.div 
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 5, ease: "linear" }}
                                className={cn("absolute bottom-0 left-0 h-[3px]", n.type === 'SUCCESS' ? "bg-emerald-500" : n.type === 'ERROR' ? "bg-red-500" : "bg-blue-500")}
                            />
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}
