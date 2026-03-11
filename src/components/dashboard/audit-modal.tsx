'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, FileText, Download, Activity, Package, Clock, ShieldCheck, RefreshCcw } from 'lucide-react'
import { Card, Badge, Button, Input, Skeleton } from '@/components/ui-library'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/context/language-context'
import { AuditService, AuditLog } from '@/services/audit.service'

interface AuditEvent {
    id: string
    type: 'SCAN' | 'ARRIVAL' | 'EXPENSE' | 'SYSTEM'
    title: string
    user: string
    time: string
    detail: string
    status: 'COMPLETED' | 'PENDING' | 'CRITICAL'
}

const mockEvents: AuditEvent[] = [
    { id: '1', type: 'SCAN', title: 'Escaneo Lote #452', user: 'Marcos P.', time: '5m atrás', detail: '250 unidades verificadas', status: 'COMPLETED' },
    { id: '2', type: 'ARRIVAL', title: 'Arribo Material', user: 'Lucía M.', time: '45m atrás', detail: 'Proveedor: Industrial Corp', status: 'COMPLETED' },
    { id: '3', type: 'EXPENSE', title: 'Gasto Aprobado', user: 'Santiago', time: '3h atrás', detail: 'Mantenimiento preventivo', status: 'COMPLETED' },
    { id: '4', type: 'SYSTEM', title: 'Backup de Base de Datos', user: 'System', time: '5h atrás', detail: 'Backup diario completado', status: 'COMPLETED' },
    { id: '5', type: 'SCAN', title: 'Escaneo Lote #451', user: 'Marcos P.', time: 'Yesterday', detail: 'Error de integridad corregido', status: 'CRITICAL' },
    { id: '6', type: 'ARRIVAL', title: 'Arribo Material', user: 'Carlos G.', time: 'Yesterday', detail: 'Materia prima tipo A', status: 'PENDING' },
    { id: '7', type: 'EXPENSE', title: 'Nómina Procesada', user: 'Admin', time: '2 days ago', detail: 'Quincena Marzo #1', status: 'COMPLETED' },
]

export const AuditModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { t } = useTranslation()
    const [search, setSearch] = React.useState('')
    const [logs, setLogs] = React.useState<AuditLog[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        if (isOpen) {
            fetchLogs()
        }
    }, [isOpen])

    const fetchLogs = async () => {
        setIsLoading(true)
        const data = await AuditService.getLogs()
        setLogs(data)
        setIsLoading(false)
    }

    const filteredEvents = logs.filter(e => 
        e.title.toLowerCase().includes(search.toLowerCase()) || 
        e.user.toLowerCase().includes(search.toLowerCase())
    )

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] bg-[var(--background)] shadow-2xl border border-[var(--border)] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                    <ShieldCheck size={24} />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Auditoría de Planta</h2>
                            </div>
                            <p className="text-[var(--muted-foreground)] text-sm font-medium">Registro histórico detallado de movimientos transaccionales.</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-12 h-12 bg-[var(--secondary)] hover:bg-[var(--border)] transition-all">
                            <X size={20} />
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="px-8 py-6 bg-[var(--secondary)]/30 flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] group-focus-within:text-blue-500 transition-colors" size={18} />
                            <Input 
                                placeholder="Buscar por evento o responsable..." 
                                className="pl-12 bg-[var(--card)] h-12 border-none ring-1 ring-[var(--border)] focus:ring-2 focus:ring-blue-500/50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={fetchLogs} className="h-12 w-12 p-0 flex items-center justify-center rounded-[16px] border border-[var(--border)]">
                                <RefreshCcw size={18} className={cn(isLoading && "animate-spin")} />
                            </Button>
                            <Button className="h-12 px-6 gap-2 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90 transition-all rounded-[16px]">
                                <Download size={18} />
                                Exportar CSV
                            </Button>
                        </div>
                    </div>

                    {/* Table / List */}
                    <div className="flex-1 overflow-y-auto p-8 pt-2">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-24 w-full rounded-[20px]" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredEvents.map((event) => (
                                    <Card key={event.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-none ring-1 ring-[var(--border)] hover:ring-blue-500/30 transition-all bg-[var(--card)] hover:shadow-md">
                                        <div className="flex items-center gap-5 flex-1">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm",
                                                event.type === 'SCAN' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                                event.type === 'ARRIVAL' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                                event.type === 'EXPENSE' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                                event.type === 'SYSTEM' && "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--border)]"
                                            )}>
                                                {event.type === 'SCAN' ? <Package size={20} /> : 
                                                 event.type === 'ARRIVAL' ? <Clock size={20} /> : 
                                                 event.type === 'EXPENSE' ? <Activity size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-[var(--foreground)]">{event.title}</h4>
                                                    <Badge variant={event.status === 'CRITICAL' ? 'critical' : event.status === 'PENDING' ? 'warning' : 'success'}>
                                                        {event.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-[var(--muted-foreground)] font-medium">
                                                    Responsable: <span className="text-[var(--foreground)] font-semibold">{event.user}</span> • {event.detail}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">{event.time}</p>
                                            <button className="text-blue-500 font-bold text-[10px] uppercase tracking-tighter hover:underline mt-1">Ver Detalles</button>
                                        </div>
                                    </Card>
                                ))}
                                {filteredEvents.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-[var(--muted-foreground)]">
                                        <div className="w-16 h-16 bg-[var(--secondary)] rounded-3xl flex items-center justify-center mb-4">
                                            <Search size={32} />
                                        </div>
                                        <p className="font-medium">No se encontraron registros para tu búsqueda.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
