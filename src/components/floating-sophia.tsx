'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, QrCode, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUnreadCount } from '@/hooks/use-unread-count'

export const FloatingSophia = ({ onOpenMessaging }: { onOpenMessaging?: () => void }) => {
    const router = useRouter()
    const unreadCount = useUnreadCount()

    return (
        <div className="fixed bottom-[100px] right-4 lg:bottom-10 lg:right-10 flex flex-col items-center gap-4 z-[100]">
            {/* Botón de Mensajería Directa con badge de no leídos */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenMessaging ? onOpenMessaging() : router.push('/dashboard?chat=true')}
                className="relative w-12 h-12 bg-[var(--card)] hover:bg-[var(--secondary)] rounded-full flex items-center justify-center text-[var(--foreground)] shadow-lg shadow-black/5 ring-1 ring-[var(--border)] backdrop-blur-md group transition-all"
            >
                <MessageSquare size={20} className="relative z-10" />

                {/* Badge de mensajes no leídos — estilo WhatsApp */}
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.div
                            key="badge"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-md shadow-red-500/40 border-2 border-[var(--background)] leading-none z-20"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-[var(--card)] text-[var(--foreground)] px-4 py-2 rounded-[16px] text-[11px] font-semibold shadow-xl border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    Mensajería Directa
                </div>
            </motion.button>

            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/operaciones?scan=true')}
                className="w-12 h-12 bg-[var(--card)] hover:bg-[var(--secondary)] rounded-full flex items-center justify-center text-[var(--foreground)] shadow-lg shadow-black/5 ring-1 ring-[var(--border)] backdrop-blur-md group transition-all"
            >
                <QrCode size={20} className="relative z-10" />
                <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-[var(--card)] text-[var(--foreground)] px-4 py-2 rounded-[16px] text-[11px] font-semibold shadow-xl border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    Escanear Lote
                </div>
            </motion.button>

            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/sophia')}
                className="w-12 h-12 bg-blue-600/90 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 cursor-pointer ring-1 ring-white/20 backdrop-blur-md group transition-colors"
            >
                <Sparkles size={20} className="relative z-10" />
                <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-[var(--card)] text-[var(--foreground)] px-4 py-2 rounded-[16px] text-[11px] font-semibold shadow-xl border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    Hablar con Sophia
                </div>
            </motion.button>
        </div>
    )
}
