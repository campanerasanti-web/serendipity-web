'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
    Menu,
    X,
    Sun,
    Moon,
    Bell,
    User as UserIcon,
    Settings,
    LogOut,
    Command as CommandIcon,
    LucideIcon,
    Languages
} from 'lucide-react'
import { Button, Badge } from '@/components/ui-library'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from '@/context/language-context'

interface HeaderProps {
    isSidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    isDesktop: boolean
    climate: any
    ClimateIcon: LucideIcon
    isDarkMode: boolean
    toggleTheme: () => void
    criticalAlerts: any[]
    hasAlerts: boolean
    alerts: any[]
    user: any
    logout: () => void
}

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

export function Header({
    isSidebarOpen,
    setSidebarOpen,
    isDesktop,
    climate,
    ClimateIcon,
    isDarkMode,
    toggleTheme,
    criticalAlerts,
    hasAlerts,
    alerts,
    user,
    logout
}: HeaderProps) {
    const router = useRouter()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isLangOpen, setIsLangOpen] = useState(false)
    const { language, setLanguage, t } = useTranslation()

    const languages = [
        { code: 'es', label: 'ES', flag: SpainFlag },
        { code: 'en', label: 'EN', flag: USAFlag },
        { code: 'vn', label: 'VN', flag: VietnamFlag },
    ]

    const currentLang = languages.find(l => l.code === language) || languages[0]

    return (
        <header className={cn(
            "fixed top-0 right-0 h-20 apple-blur border-b border-[var(--climate-border)] z-40 px-6 lg:px-12 flex items-center justify-between transition-all duration-300",
            isDesktop ? (isSidebarOpen ? "left-[280px]" : "left-[88px]") : "left-0"
        )}>
            <div className="flex items-center gap-4 sm:gap-6">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)} className="!rounded-full hover:bg-[var(--secondary)] transition-colors overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={isSidebarOpen ? 'close' : 'menu'}
                            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.div>
                    </AnimatePresence>
                </Button>
                <div className="hidden sm:flex items-center gap-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{t('common.system')}</p>
                        <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight leading-none mt-1">{t('common.commandCenter')}</h2>
                    </div>

                    {climate && (
                        <div className="flex items-center gap-3 pl-4 border-l border-[var(--climate-border)] transition-colors duration-300">
                            <div className="p-2 bg-[var(--climate-glow)] text-[var(--climate-primary)] rounded-lg transition-colors duration-300">
                                <ClimateIcon size={18} />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{t('common.climate')}: {climate.season}</p>
                                <p className="text-[11px] font-medium text-[var(--foreground)] opacity-70 leading-none mt-0.5">{climate.message}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[var(--secondary)] border border-[var(--border)] rounded-xl text-[10px] font-bold text-[var(--muted-foreground)] cursor-pointer hover:border-[var(--muted-foreground)] transition-all" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
                    <CommandIcon size={12} /> {t('common.search')}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="!rounded-2xl border border-[var(--border)] shadow-sm bg-[var(--card)] px-4 text-[11px] font-bold uppercase tracking-[0.2em] h-10 flex gap-3 items-center hover:bg-[var(--secondary)] transition-all group overflow-hidden text-[var(--foreground)]"
                        >
                            <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden rounded-full border border-white/20 shadow-sm shrink-0 bg-[var(--secondary)]">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={currentLang.code}
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -15, opacity: 0 }}
                                        className="absolute inset-0"
                                    >
                                        <currentLang.flag />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <span className="min-w-[20px] text-center">{currentLang.label}</span>
                        </Button>

                        <AnimatePresence>
                            {isLangOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-4 w-56 bg-[var(--card)] border border-[var(--border)] rounded-[20px] shadow-2xl z-50 overflow-hidden p-1.5"
                                    >
                                        <div className="space-y-1">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        setLanguage(lang.code as any)
                                                        setIsLangOpen(false)
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[11px] font-bold uppercase tracking-wider transition-all",
                                                        language === lang.code
                                                            ? "bg-[var(--secondary)] text-[var(--foreground)]"
                                                            : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                                                    )}
                                                >
                                                    <div className="w-5 h-5 rounded-full overflow-hidden border border-[var(--border)] shadow-sm">
                                                        <lang.flag />
                                                    </div>
                                                    {lang.label} - {lang.code === 'es' ? 'Español' : lang.code === 'en' ? 'English' : 'Tiếng Việt'}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button variant="ghost" size="icon" onClick={toggleTheme} className="!rounded-full border border-[var(--border)] shadow-sm bg-[var(--card)] w-10 h-10">
                        {isDarkMode ? <Sun size={18} className="text-blue-500" /> : <Moon size={18} />}
                    </Button>
                </div>

                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "!rounded-full border border-[var(--border)] shadow-sm relative bg-[var(--card)]",
                            criticalAlerts.length > 0 ? "text-red-500" : "text-[var(--muted-foreground)]"
                        )}
                    >
                        <Bell size={20} className={cn(criticalAlerts.length > 0 && "animate-bounce")} />
                        {hasAlerts && (
                            <span className={cn(
                                "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-2 border-[var(--card)]",
                                criticalAlerts.length > 0 ? "bg-red-500" : "bg-blue-500"
                            )}>
                                {alerts.length}
                            </span>
                        )}
                    </Button>
                </div>

                <div className="relative">
                    <div
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-5 pl-6 border-l border-[var(--border)] cursor-pointer group"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-[var(--foreground)]">{user.name}</p>
                            <div className="flex items-center justify-end gap-2 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] leading-none font-mono">{user.role}</p>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-[var(--foreground)] text-[var(--background)] rounded-[16px] flex items-center justify-center shadow-lg group-hover:border-[var(--climate-primary)] border-2 border-transparent transition-all overflow-hidden relative">
                            <UserIcon size={22} className="group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 mt-4 w-64 bg-[var(--card)] border border-[var(--border)] rounded-[24px] shadow-2xl z-50 overflow-hidden p-2"
                                >
                                    <div className="px-5 py-4 border-b border-[var(--border)] md:hidden">
                                        <p className="text-sm font-bold text-[var(--foreground)]">{user.name}</p>
                                        <p className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] tracking-wider font-mono">{user.role}</p>
                                    </div>

                                    <div className="p-1 space-y-1">
                                        <button
                                            onClick={() => {
                                                router.push('/dashboard/configuracion')
                                                setIsProfileOpen(false)
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-all"
                                        >
                                            <Settings size={18} />
                                            {t('common.accountSettings')}
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
                                        >
                                            <LogOut size={18} />
                                            {t('common.logout')}
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    )
}
