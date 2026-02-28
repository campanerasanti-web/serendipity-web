'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui-library'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error('Anthropos System Error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 selection:bg-blue-200">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center space-y-12 relative z-10"
            >
                <div className="space-y-6">
                    <motion.div
                        animate={{
                            rotate: [0, -5, 5, -5, 5, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-24 h-24 bg-red-500/10 rounded-[32px] flex items-center justify-center mx-auto text-red-500 border border-red-500/20 shadow-xl"
                    >
                        <AlertTriangle size={48} />
                    </motion.div>

                    <div className="space-y-3">
                        <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-[var(--foreground)] leading-tight">Error de Sincronía</h1>
                        <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Anomalía en el Flujo de Datos</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
                        "{error.message || 'Error desconocido en el motor de simetría'}"
                    </h2>
                    <p className="text-[var(--muted-foreground)] font-medium leading-relaxed max-w-sm mx-auto">
                        Sophia ha detectado una anomalía detectada en la integridad del flujo. Se recomienda reconfigurar el nodo o volver al centro de mando.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                        variant="secondary"
                        onClick={() => reset()}
                        className="flex-1 gap-2 !rounded-[18px] h-14 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                    >
                        <RefreshCw size={18} /> Reintentar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 gap-2 !rounded-[18px] h-14"
                    >
                        <Home size={18} /> Ir al Centro
                    </Button>
                </div>

                {error.digest && (
                    <p className="text-[9px] font-mono text-[var(--muted-foreground)] opacity-50">
                        Error ID: {error.digest}
                    </p>
                )}
            </motion.div>
        </div>
    )
}
