'use client'

import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
    const [progress, setProgress] = useState(0)
    const [logs, setLogs] = useState<string[]>([])

    const logsList = [
        "ACCESSING_CORE_KERNEL...",
        "DECRYPTING_BIO_METRICS...",
        "ESTABLISHING_NEURAL_LINK...",
        "SYNCING_SOPHIA_DATABASE...",
        "OPTIMIZING_OPERATIONAL_MATRICES...",
        "CALIBRATING_FINANCIAL_SPECTROMETER...",
        "VERIFYING_SYMMETRY_PROTOCOLS...",
        "ANTHROPOS_READY."
    ]

    const springProgress = useSpring(0, {
        stiffness: 30,
        damping: 20
    })

    const displayProgress = useTransform(springProgress, (latest) => Math.min(100, Math.round(latest)))

    useEffect(() => {
        const startTime = Date.now()
        const minDuration = 1500 // Balanced: fast enough for UX, long enough for cinematic logo log flow

        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime

            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    if (onComplete) {
                        const remaining = Math.max(0, minDuration - elapsedTime)
                        setTimeout(onComplete, remaining)
                    }
                    return 100
                }

                // Jump-like progress typical of system boots
                const next = prev + (Math.random() < 0.3 ? Math.random() * 20 : Math.random() * 5)
                return next >= 100 ? 100 : next
            })
        }, 120)

        return () => clearInterval(interval)
    }, [onComplete])

    useEffect(() => {
        springProgress.set(progress)

        // Add logs based on progress
        const logIndex = Math.floor((progress / 100) * logsList.length)
        if (logIndex < logsList.length && !logs.includes(logsList[logIndex])) {
            setLogs(prev => {
                if (prev.includes(logsList[logIndex])) return prev
                return [...prev.slice(-3), logsList[logIndex]]
            })
        }
    }, [progress, springProgress, logs])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden font-mono transition-colors duration-500"
        >
            {/* Background Data Stream Effect */}
            <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04] flex flex-wrap gap-4 p-4 select-none pointer-events-none overflow-hidden">
                {Array.from({ length: 80 }).map((_, i) => (
                    <span key={i} className="text-[9px] text-blue-500 whitespace-nowrap">
                        {Math.random().toString(36).substring(5).toUpperCase()}
                    </span>
                ))}
            </div>

            {/* Scanning Line Effect */}
            <motion.div
                className="absolute inset-x-0 h-[1.5px] bg-red-500/40 z-10 blur-sm shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative w-full max-w-sm px-6 space-y-12">
                {/* Header Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.3em] text-blue-600 dark:text-blue-500/60">
                        <span>SERENDIPITY_OS_V1.0</span>
                        <span className="tabular-nums font-mono">{new Date().toLocaleTimeString()}</span>
                    </div>

                    <div className="relative h-px w-full overflow-hidden">
                        <div className="absolute inset-0 bg-slate-200 dark:bg-white/10" />
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-blue-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Log Terminal Area */}
                    <div className="h-24 flex flex-col justify-end space-y-2.5">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {logs.map((log) => (
                                <motion.p
                                    key={log}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-[10px] text-blue-600 dark:text-blue-500/90 tracking-[0.2em] font-bold flex items-center gap-3"
                                >
                                    <span className={cn("w-1 h-1 rounded-full shrink-0 shadow-lg", logs.indexOf(log) % 2 === 0 ? "bg-red-500 shadow-red-500/50" : "bg-blue-500 shadow-blue-500/50")} />
                                    {log}
                                </motion.p>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Progress Monitor */}
                    <div className="space-y-6">
                        <div className="flex items-baseline justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-400 dark:text-white/40 tracking-[0.4em]">SYSTEM_INITIALIZING</span>
                                <span className="text-[8px] text-blue-600/50 dark:text-blue-500/40 tracking-[0.2em]">KRN_LDR: RUNNING_STABLE</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <motion.span className="text-5xl font-extralight tabular-nums text-foreground tracking-tighter">
                                    {displayProgress}
                                </motion.span>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-500/60 leading-none">%</span>
                            </div>
                        </div>

                        {/* High-End Progress Bar */}
                        <div className="relative h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 backdrop-blur-xl">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-blue-500"
                                style={{ width: `${progress}%` }}
                                transition={{ type: 'spring', stiffness: 20, damping: 10 }}
                            >
                                {/* Lead Glow effect */}
                                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/60 dark:from-white/40 to-transparent shadow-[0_0_25px_var(--primary)]" />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Footer Status Indicators */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'MEM', status: 'OK' },
                        { label: 'CORE', status: 'SYNC' },
                        { label: 'NET', status: 'SEC' }
                    ].map((item, i) => (
                        <div key={i} className="py-2.5 px-1 border border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-white/[0.03] text-center">
                            <p className="text-[8px] font-black text-blue-600/40 dark:text-blue-500/30 tracking-widest mb-1">{item.label}</p>
                            <p className="text-[10px] font-black text-slate-500 dark:text-white/60 tracking-wider transition-all">
                                {progress > (i + 1) * 30 ? item.status : '...'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
