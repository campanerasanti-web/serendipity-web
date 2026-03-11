'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/context/auth-context'
import { useSettings } from '@/hooks/use-settings'
import { toast } from 'sonner'

export function useSessionTimeout() {
    const { logout, user } = useAuth()
    const { settings } = useSettings()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    // Convert minutes from settings to milliseconds
    const timeoutDuration = (settings.security.sessionTimeoutMinutes || 45) * 60 * 1000

    const resetTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        
        if (user) {
            timeoutRef.current = setTimeout(() => {
                toast.warning('Bómer de seguridad: Sesión expirada por inactividad', {
                    description: 'Tu sesión ha sido cerrada automáticamente para proteger los datos del Sagrario.'
                })
                logout()
            }, timeoutDuration)
        }
    }

    useEffect(() => {
        if (!user) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            return
        }

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
        
        events.forEach(event => {
            window.addEventListener(event, resetTimer)
        })

        resetTimer()

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, resetTimer)
            })
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [user, timeoutDuration])
}
