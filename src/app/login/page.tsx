'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, UserRole } from '@/context/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, User, ChevronDown, ArrowRight, ChevronLeft } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui-library'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { toast } from 'sonner'
import { useTranslation } from '@/context/language-context'
import { AuthControls } from '@/components/auth-controls'

export default function LoginPage() {
    const { login, loading } = useAuth()
    const { t, language } = useTranslation()
    const router = useRouter()
    const [identity, setIdentity] = useState('')
    const [password, setPassword] = useState('')
    const [authority, setAuthority] = useState<UserRole>('ADMIN')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(identity, authority)
            router.push('/dashboard')
            toast.success(language === 'es' ? 'Acceso Autorizado' : language === 'en' ? 'Access Authorized' : 'Truy cập được ủy quyền', {
                description: language === 'es' ? 'Bienvenido al núcleo de Serendipity.' : language === 'en' ? 'Welcome to the Serendipity core.' : 'Chào mừng bạn đến với lõi Serendipity.'
            })
        } catch (error) {
            toast.error(language === 'es' ? 'Error de Acceso' : language === 'en' ? 'Access Error' : 'Lỗi truy cập', {
                description: language === 'es' ? 'Credenciales inválidas.' : language === 'en' ? 'Invalid credentials.' : 'Thông tin xác thực không hợp lệ.'
            })
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] transition-colors duration-500 p-4 pt-24 sm:pt-4 font-sans relative">

            {/* ← Volver a landing */}
            <div className="absolute top-6 left-4 sm:top-8 sm:left-8 z-50">
                <Link href="/landing">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="!rounded-2xl border border-[var(--border)] shadow-sm bg-[var(--card)] px-4 text-[11px] font-bold uppercase tracking-[0.2em] h-10 flex gap-2 items-center hover:bg-[var(--secondary)] transition-all text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                        <ChevronLeft size={14} /> Inicio
                    </Button>
                </Link>
            </div>

            {/* Controls Overlay */}
            <div className="absolute top-6 right-4 sm:top-8 sm:right-8 z-50">
                <AuthControls />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[440px]"
            >
                <Card className="p-6 sm:p-10 !rounded-[24px] sm:!rounded-[32px] overflow-hidden relative shadow-2xl bg-[var(--card)] border-[var(--border)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-red-500" />

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-[20px] mb-6 premium-shadow">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-[28px] font-bold tracking-tight text-[var(--foreground)] mb-2">{t('auth.title')}</h1>
                        <p className="text-[var(--muted-foreground)] text-sm font-medium">{t('auth.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[var(--muted-foreground)] ml-1">{t('auth.identity')}</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within:text-blue-600 transition-colors">
                                    <User size={18} />
                                </div>
                                <Input
                                    type="text"
                                    required
                                    value={identity}
                                    onChange={(e) => setIdentity(e.target.value)}
                                    placeholder="ant-santiago-01"
                                    className="pl-12 !bg-[var(--secondary)] border-transparent focus:!bg-[var(--card)] focus:ring-2 focus:ring-blue-600/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[var(--muted-foreground)] ml-1">{t('auth.password')}</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-12 !bg-[var(--secondary)] border-transparent focus:!bg-[var(--card)] focus:ring-2 focus:ring-blue-600/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 relative">
                            <label className="text-[13px] font-semibold text-[var(--muted-foreground)] ml-1">{t('auth.authority')}</label>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={cn(
                                    "w-full bg-[var(--secondary)] border border-transparent rounded-[12px] px-4 py-3 text-sm text-left flex items-center justify-between transition-all outline-none text-[var(--foreground)]",
                                    isDropdownOpen ? "ring-2 ring-blue-600 bg-[var(--card)]" : "hover:bg-[var(--border)]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-[var(--muted-foreground)]"><Shield size={18} /></div>
                                    <span className="font-medium">
                                        {authority === 'ADMIN' ? t('auth.admin') : authority === 'SUPERVISOR' ? t('auth.supervisor') : t('auth.plant')}
                                    </span>
                                </div>
                                <ChevronDown size={18} className={cn("text-[var(--muted-foreground)] transition-transform", isDropdownOpen && "rotate-180")} />
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
                                                { value: 'ADMIN', label: t('auth.admin'), desc: t('auth.adminDesc') },
                                                { value: 'SUPERVISOR', label: t('auth.supervisor'), desc: t('auth.supervisorDesc') },
                                                { value: 'OPERATIVO', label: t('auth.plant'), desc: t('auth.plantDesc') },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setAuthority(option.value as UserRole)
                                                        setIsDropdownOpen(false)
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-3 rounded-[16px] text-sm transition-all flex items-center justify-between group",
                                                        authority === option.value ? "bg-blue-600 text-white" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                                                    )}
                                                >
                                                    <div>
                                                        <p className={cn("font-bold", authority === option.value ? "text-white" : "text-[var(--foreground)]")}>{option.label}</p>
                                                        <p className={cn("text-[10px] uppercase font-semibold tracking-wider", authority === option.value ? "text-white/70" : "text-[var(--muted-foreground)]")}>{option.desc}</p>
                                                    </div>
                                                    {authority === option.value && <div className="w-2 h-2 rounded-full bg-black/20 shadow-sm" />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-4 h-12 text-base !rounded-[16px] bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
                            isLoading={loading}
                        >
                            {t('auth.login')}
                            {!loading && <ArrowRight size={18} className="ml-2" />}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                        <p className="text-sm text-[var(--muted-foreground)]">
                            {t('auth.noAccount')}{' '}
                            <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                                {t('auth.register')}
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
