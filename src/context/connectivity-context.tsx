'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react'

interface ConnectivityContextType {
    isOnline: boolean
    wasOffline: boolean
}

const ConnectivityContext = createContext<ConnectivityContextType>({
    isOnline: true,
    wasOffline: false
})

export function ConnectivityProvider({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(true)
    const [wasOffline, setWasOffline] = useState(false)
    const [showStatus, setShowStatus] = useState(false)

    useEffect(() => {
        // Initial state
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            setShowStatus(true)
            // Hide "Back Online" message after 3s
            setTimeout(() => setShowStatus(false), 3000)
        }

        const handleOffline = () => {
            setIsOnline(false)
            setWasOffline(true)
            setShowStatus(true)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return (
        <ConnectivityContext.Provider value={{ isOnline, wasOffline }}>
            {children}
            
            {/* Elegant Status Toast */}
            <AnimatePresence>
                {showStatus && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
                    >
                        <div className={`
                            px-6 py-3 rounded-full backdrop-blur-xl border flex items-center gap-3 shadow-2xl
                            ${isOnline 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}
                        `}>
                            {isOnline ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Back Online</span>
                                    <Wifi size={16} />
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Offline Mode Active</span>
                                    <WifiOff size={16} />
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ConnectivityContext.Provider>
    )
}

export const useConnectivity = () => useContext(ConnectivityContext)
