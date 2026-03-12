'use client'

import { useNotifications } from '@/context/notification-context'
import { Card } from '@/components/ui-library'
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/context/language-context'
import { motion } from 'framer-motion'

export default function NotificacionesPage() {
    const { notifications, clearAll } = useNotifications()
    const { t, language } = useTranslation()

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="text-emerald-500" size={18} />
            case 'ERROR': return <XCircle className="text-red-500" size={18} />
            case 'WARNING': return <AlertTriangle className="text-amber-500" size={18} />
            case 'INFO': return <Info className="text-blue-500" size={18} />
            case 'CRITICAL': return <AlertTriangle className="text-red-600" size={18} />
            default: return <Info className="text-blue-500" size={18} />
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] font-outfit">
                        {language === 'es' ? 'Centro de Notificaciones' : 'Notification Center'}
                    </h1>
                    <p className="text-sm font-medium text-[var(--muted-foreground)]">
                        {language === 'es' ? 'Trazabilidad de eventos y alertas del sistema.' : 'Traceability of system events and alerts.'}
                    </p>
                </div>
                {notifications.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors px-4 py-2 bg-red-500/5 hover:bg-red-500/10 rounded-xl"
                    >
                        {t('common.clear') ?? 'Limpiar Todo'}
                    </button>
                )}
            </div>

            <Card className="overflow-hidden border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm rounded-[32px] p-0 shadow-sm">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-6 opacity-40">
                            <Bell size={32} className="text-[var(--muted-foreground)]" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">{t('common.noAlerts') ?? 'Sin alertas activas'}</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-xs">{language === 'es' ? 'Tu flujo operativo se mantiene en balance y silencio.' : 'Your operational flow remains in balance and silence.'}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--border)]">
                        {[...notifications].map((notif, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={notif.id} 
                                className="flex gap-4 p-5 sm:p-6 hover:bg-[var(--secondary)]/30 transition-all items-start group"
                            >
                                <div className={cn(
                                    "p-2.5 rounded-2xl shrink-0 transition-transform group-hover:scale-110",
                                    notif.type === 'CRITICAL' || notif.type === 'ERROR' ? "bg-red-500/10" : "bg-blue-500/10"
                                )}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                                        <h4 className="font-bold text-[15px] text-[var(--foreground)] tracking-tight">{notif.title}</h4>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] opacity-60">
                                            {new Date(notif.timestamp).toLocaleString(language === 'es' ? 'es-ES' : 'en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-medium">{notif.message}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
