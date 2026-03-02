'use client'

/**
 * AuthControls — selector de idioma + toggle de tema reutilizable.
 * Se usa en: login, register y landing.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui-library'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/context/language-context'

/* ─── Flags ─────────────────────────────────────────────────────── */
const SpainFlag = () => (
    <svg viewBox="0 0 512 512" className="w-full h-full">
        <path fill="#AA151B" d="M0 0h512v128H0zM0 384h512v128H0z" />
        <path fill="#F1BF00" d="M0 128h512v256H0z" />
        <circle cx="150" cy="256" r="40" fill="#AA151B" opacity="0.2" />
    </svg>
)

const USAFlag = () => (
    <svg viewBox="0 0 512 512" className="w-full h-full">
        <path fill="#FFF" d="M0 0h512v512H0z" />
        <path fill="#B22234" d="M0 0h512v39H0zm0 78h512v39H0zm0 79h512v39H0zm0 79h512v39H0zm0 78h512v39H0zm0 79h512v39H0zm0 79h512v39H0z" />
        <path fill="#3C3B6E" d="M0 0h204v274H0z" />
        <circle cx="102" cy="137" r="40" fill="#FFF" opacity="0.4" />
    </svg>
)

const VietnamFlag = () => (
    <svg viewBox="0 0 512 512" className="w-full h-full">
        <path fill="#da251d" d="M0 0h512v512H0z" />
        <path fill="#ffff00" d="M256 100l27.1 83.5H371l-71.1 51.6 27.1 83.5-71-51.6-71 51.6 27.2-83.5-71.1-51.6h87.9z" />
    </svg>
)

const LANGUAGES = [
    { code: 'es', label: 'ES', Flag: SpainFlag, name: 'Español' },
    { code: 'en', label: 'EN', Flag: USAFlag, name: 'English' },
    { code: 'vn', label: 'VN', Flag: VietnamFlag, name: 'Tiếng Việt' },
] as const

/* ─── Component ─────────────────────────────────────────────────── */
export function AuthControls() {
    const { language, setLanguage } = useTranslation()
    const [isLangOpen, setIsLangOpen] = useState(false)
    const [isDark, setIsDark] = useState(false)

    // Sync with current theme on mount
    useEffect(() => {
        const theme = document.documentElement.getAttribute('data-theme')
        setIsDark(theme === 'dark')
    }, [])

    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    }

    const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

    return (
        <div className="flex items-center gap-2 sm:gap-3">
            {/* Language selector */}
            <div className="relative">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLangOpen(o => !o)}
                    className="!rounded-2xl border border-[var(--border)] shadow-sm bg-[var(--card)] px-4 text-[11px] font-bold uppercase tracking-[0.2em] h-10 flex gap-3 items-center hover:bg-[var(--secondary)] transition-all overflow-hidden text-[var(--foreground)]"
                >
                    <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden rounded-full border border-white/20 shadow-sm shrink-0">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={current.code}
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -15, opacity: 0 }}
                                className="absolute inset-0"
                            >
                                <current.Flag />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <span>{current.label}</span>
                </Button>

                <AnimatePresence>
                    {isLangOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                className="absolute right-0 mt-2 w-56 bg-[var(--card)] border border-[var(--border)] rounded-[20px] shadow-2xl z-50 overflow-hidden p-1.5"
                            >
                                <div className="space-y-0.5">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code as any)
                                                setIsLangOpen(false)
                                            }}
                                            className={cn(
                                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[11px] font-bold uppercase tracking-wider transition-all',
                                                language === lang.code
                                                    ? 'bg-[var(--secondary)] text-[var(--foreground)]'
                                                    : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                                            )}
                                        >
                                            <div className="w-5 h-5 rounded-full overflow-hidden border border-[var(--border)] shadow-sm shrink-0">
                                                <lang.Flag />
                                            </div>
                                            {lang.label} - {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="!rounded-full border border-[var(--border)] shadow-sm bg-[var(--card)] w-10 h-10 text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all"
            >
                {isDark ? <Sun size={18} className="text-blue-500" /> : <Moon size={18} />}
            </Button>
        </div>
    )
}
