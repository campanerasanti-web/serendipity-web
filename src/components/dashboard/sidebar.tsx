'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MenuItem {
    name: string
    icon: LucideIcon
    href: string
    roles: string[]
}

interface SidebarProps {
    isOpen: boolean
    isDesktop: boolean
    setOpen: (open: boolean) => void
    menuItems: MenuItem[]
}

export function Sidebar({ isOpen, isDesktop, setOpen, menuItems }: SidebarProps) {
    const pathname = usePathname()

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isOpen ? 280 : (isDesktop ? 88 : 0),
                x: !isDesktop && !isOpen ? -280 : 0
            }}
            className={cn(
                "fixed inset-y-0 left-0 bg-[var(--card)]/80 apple-blur border-r border-[var(--climate-border)] z-50 overflow-hidden transition-all duration-300",
                !isDesktop && "shadow-2xl shadow-black/20"
            )}
        >
            <div className="h-24 flex items-center px-8 mb-4">
                <AnimatePresence mode="wait">
                    {(isOpen || !isDesktop) ? (
                        <motion.span
                            key="text"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-2xl font-black tracking-tighter text-blue-600"
                        >
                            Serendipity
                        </motion.span>
                    ) : (
                        <motion.span
                            key="dot"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-sm"
                        >
                            S
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <nav className="px-4 space-y-1.5">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            prefetch={true}
                            onClick={() => {
                                if (!isDesktop) setOpen(false)
                            }}
                            className={cn(
                                "flex items-center gap-4 p-3 rounded-[14px] transition-all duration-200 group relative",
                                isActive ? "bg-[var(--climate-primary)] text-white shadow-lg shadow-[var(--climate-glow)]" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]",
                                isDesktop && !isOpen && "justify-center"
                            )}
                        >
                            <item.icon size={22} className={cn("shrink-0 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                            {(isOpen || !isDesktop) && (
                                <span className="font-semibold text-[15px] whitespace-nowrap">{item.name}</span>
                            )}
                            {(isOpen || !isDesktop) && isActive && (
                                <motion.div layoutId="active-nav" className="absolute right-3">
                                    <ChevronRight size={16} className="opacity-50" />
                                </motion.div>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </motion.aside>
    )
}
