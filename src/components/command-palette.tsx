'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Command as CommandIcon,
    LayoutDashboard,
    Package,
    BarChart3,
    History,
    Settings,
    X,
    ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

export const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const actions = [
        { name: 'Ir a Punto Cero', icon: LayoutDashboard, href: '/dashboard', roles: ['ADMIN', 'SUPERVISOR', 'OPERATIVO'] },
        { name: 'Ver Matriz de Ritmos', icon: Package, href: '/dashboard/operaciones', roles: ['ADMIN', 'SUPERVISOR', 'OPERATIVO'] },
        { name: 'Consultar Jardín de Datos', icon: BarChart3, href: '/dashboard/reportes', roles: ['ADMIN', 'SUPERVISOR'] },
        { name: 'Revisar Fondo de Paz', icon: History, href: '/dashboard/finanzas', roles: ['ADMIN'] },
        { name: 'Configurar El Templo', icon: Settings, href: '/dashboard/configuracion', roles: ['ADMIN'] },
    ]

    const filteredActions = actions
        .filter(action => action.roles.includes(user?.role || ''))
        .filter(action => action.name.toLowerCase().includes(query.toLowerCase()))

    const navigate = (href: string) => {
        router.push(href)
        setIsOpen(false)
        setQuery('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[var(--card)]/90 apple-blur border border-[var(--border)] rounded-[28px] shadow-2xl z-[101] overflow-hidden"
                    >
                        <div className="p-6 border-b border-[var(--border)] flex items-center gap-4">
                            <Search className="text-[var(--muted-foreground)]" size={24} />
                            <input
                                autoFocus
                                placeholder="Escribe un comando o busca una sección..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                            />
                            <div className="flex items-center gap-2 px-3 py-1 bg-[var(--secondary)] rounded-lg text-[10px] font-bold text-[var(--muted-foreground)]">
                                <CommandIcon size={12} /> K
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto p-3">
                            {filteredActions.length > 0 ? (
                                <div className="space-y-1">
                                    <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Comandos Rápidos</p>
                                    {filteredActions.map((action) => (
                                        <button
                                            key={action.name}
                                            onClick={() => navigate(action.href)}
                                            className="w-full flex items-center justify-between p-4 rounded-[18px] hover:bg-[var(--secondary)] transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[var(--card)] border border-[var(--border)] rounded-[12px] flex items-center justify-center text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-all">
                                                    <action.icon size={20} />
                                                </div>
                                                <span className="font-bold text-[var(--foreground)]">{action.name}</span>
                                            </div>
                                            <ArrowRight size={18} className="text-[var(--border)] group-hover:text-[var(--foreground)] group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center mx-auto text-[var(--muted-foreground)]">
                                        <Search size={32} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--foreground)]">No hay resultados para "{query}"</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">Sophia no encuentra esa simetría tecnológica.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-[var(--secondary)]/50 border-t border-[var(--border)] flex justify-between items-center text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                            <span>Navega con las flechas</span>
                            <span>Presiona Enter para ejecutar</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
