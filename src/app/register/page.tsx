'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, UserRole } from '@/context/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, ArrowRight, ChevronDown, Mail, User, Shield, Sun, Moon } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui-library'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useTranslation } from '@/context/language-context'

export default function RegisterPage() {
    const { t, language, setLanguage } = useTranslation()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [role, setRole] = useState<UserRole>('OPERATIVO')
    const [isLoading, setIsLoading] = useState(false)
    const [isLangOpen, setIsLangOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const theme = document.documentElement.getAttribute('data-theme')
        setIsDarkMode(theme === 'dark')
    }, [])

    const toggleTheme = () => {
        const next = !isDarkMode
        setIsDarkMode(next)
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            login(email, role)
            router.push('/dashboard')
        }, 1200)
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

    const languages = [
        { code: 'es', label: 'ES', flag: SpainFlag },
        { code: 'en', label: 'EN', flag: USAFlag },
        { code: 'vn', label: 'VN', flag: VietnamFlag },
    ]

    const currentLang = languages.find(l => l.code === language) || languages[0]

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] transition-colors duration-500 p-4 font-sans relative">
            {/* Controls Overlay - Positioned better for mobile */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 sm:gap-3 z-50">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="!rounded-2xl border border-[var(--border)] shadow-sm bg-[var(--card)] px-4 text-[11px] font-bold uppercase tracking-[0.2em] h-10 flex gap-3 items-center hover:bg-[var(--secondary)] transition-all group overflow-hidden text-[var(--foreground)]"
                    >
                        <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden rounded-full border border-white/20 shadow-sm shrink-0">
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
                        <span>{currentLang.label}</span>
                    </Button>

                    <AnimatePresence>
                        {isLangOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 mt-4 w-56 bg-[var(--card)] border border-[var(--border)] rounded-[20px] shadow-2xl z-50 overflow-hidden p-1.5"
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

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="!rounded-full border border-[var(--border)] shadow-sm bg-[var(--card)] w-10 h-10 text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all"
                >
                    {isDarkMode ? <Sun size={18} className="text-blue-500" /> : <Moon size={18} />}
                </Button>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-[440px]"
            >
                <Card className="p-6 sm:p-10 !rounded-[24px] sm:!rounded-[32px] overflow-hidden relative shadow-2xl bg-[var(--card)] border-[var(--border)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-red-500" />

                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-[20px] mb-6 premium-shadow"
                        >
                            <UserPlus size={32} />
                        </motion.div>
                        <h1 className="text-[28px] font-bold tracking-tight text-[var(--foreground)] mb-2">{t('auth.registerTitle')}</h1>
                        <p className="text-[var(--muted-foreground)] text-sm font-medium">{t('auth.registerSubtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[var(--muted-foreground)] ml-1">{t('auth.nameLabel')}</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within:text-blue-600 transition-colors">
                                    <User size={18} />
                                </div>
                                <Input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('auth.namePlaceholder')}
                                    className="pl-12 !bg-[var(--secondary)] border-transparent focus:!bg-[var(--card)] focus:ring-2 focus:ring-blue-600/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[var(--muted-foreground)] ml-1">{t('auth.emailLabel')}</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.emailPlaceholder')}
                                    className="pl-12 !bg-[var(--secondary)] border-transparent focus:!bg-[var(--card)] focus:ring-2 focus:ring-blue-600/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 relative">
                            <label className="text-[13px] font-semibold text-[var(--muted-foreground)] ml-1">{t('auth.authority')}</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                                    className={cn(
                                        "w-full bg-[var(--secondary)] border border-transparent rounded-[12px] px-4 py-3 text-sm text-left flex items-center justify-between transition-all outline-none text-[var(--foreground)]",
                                        isDropdownOpen ? "ring-2 ring-blue-600 bg-[var(--card)]" : "hover:bg-[var(--border)]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-[var(--muted-foreground)]"><Shield size={18} /></div>
                                        <span className="font-medium">
                                            {role === 'ADMIN' ? t('auth.admin') : role === 'SUPERVISOR' ? t('auth.supervisor') : t('auth.plant')}
                                        </span>
                                    </div>
                                    <ChevronDown size={18} className={cn("text-[var(--muted-foreground)] transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute bottom-full mb-2 left-0 right-0 bg-[var(--card)] border border-[var(--border)] rounded-[24px] shadow-2xl z-20 overflow-hidden p-1.5"
                                            >
                                                {[
                                                    { value: 'SUPERVISOR', label: t('auth.supervisor'), desc: t('auth.supervisorDesc') },
                                                    { value: 'OPERATIVO', label: t('auth.plant'), desc: t('auth.plantDesc') }
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setRole(option.value as UserRole)
                                                            setIsDropdownOpen(false)
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-4 py-3 rounded-[16px] text-sm transition-all flex items-center justify-between group",
                                                            role === option.value ? "bg-blue-600 text-white" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                                                        )}
                                                    >
                                                        <div>
                                                            <p className={cn("font-bold", role === option.value ? "text-white" : "text-[var(--foreground)]")}>{option.label}</p>
                                                            <p className={cn("text-[10px] uppercase font-semibold tracking-wider", role === option.value ? "text-white/70" : "text-[var(--muted-foreground)]")}>{option.desc}</p>
                                                        </div>
                                                        {role === option.value && <div className="w-2 h-2 rounded-full bg-black/20 shadow-sm" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-4 h-12 text-base !rounded-[16px] bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
                            isLoading={isLoading}
                        >
                            {t('auth.createAccount')}
                            {!isLoading && <ArrowRight size={18} className="ml-2" />}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                        <p className="text-sm text-[var(--muted-foreground)]">
                            {t('auth.alreadyHaveAccount')}{' '}
                            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                                {t('auth.loginAction')}
                            </Link>
                        </p>
                    </div>

                    <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]/50">
                        Serendipity Bros © 2026
                    </p>
                </Card>
            </motion.div>
        </div>
    )
}
