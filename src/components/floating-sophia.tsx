'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const FloatingSophia = () => {
    const router = useRouter()

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard/sophia')}
            className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 w-12 h-12 bg-blue-600/90 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 z-[100] cursor-pointer ring-1 ring-white/20 backdrop-blur-md group transition-colors"
        >
            <Sparkles size={20} className="relative z-10" />
            <div className="absolute -top-12 right-0 bg-[var(--card)] text-[var(--foreground)] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                Hablar con Sophia
            </div>
        </motion.button>
    )
}
