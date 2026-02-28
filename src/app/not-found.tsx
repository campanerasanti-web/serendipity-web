'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui-library'
import { Ghost, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 selection:bg-blue-200">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center space-y-12 relative z-10"
            >
                <div className="space-y-6">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-[var(--secondary)] rounded-[32px] flex items-center justify-center mx-auto text-[var(--muted-foreground)] border border-[var(--border)] shadow-xl"
                    >
                        <Ghost size={48} />
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-7xl font-black tracking-tighter text-[var(--foreground)] leading-none">404</h1>
                        <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-[var(--primary)]">Dimensión Inexistente</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Sophia no encuentra este nodo.</h2>
                    <p className="text-[var(--muted-foreground)] font-medium leading-relaxed">
                        Parece que el flujo de datos te ha llevado a una sección que no ha sido sincronizada con el sistema Anthropos.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                        variant="secondary"
                        onClick={() => router.back()}
                        className="flex-1 gap-2 !rounded-[18px] h-14"
                    >
                        <ArrowLeft size={18} /> Volver Atrás
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 gap-2 !rounded-[18px] h-14"
                    >
                        <Home size={18} /> Ir al Centro
                    </Button>
                </div>

                <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest pt-8 transition-opacity duration-1000">
                    Sistema Anthropos v1.0 • Nodo Desconectado
                </p>
            </motion.div>
        </div>
    )
}
