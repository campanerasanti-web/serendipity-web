'use client'

import { Card, Badge, Button, Skeleton } from '@/components/ui-library'
import { Package, QrCode, ArrowRight, Play, CheckCircle2, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useOperations } from '@/hooks/use-operations'
import dynamic from 'next/dynamic'
import { useTranslation } from '@/context/language-context'

const SophiaEye = dynamic(() => import('@/components/sophia-eye').then(mod => mod.SophiaEye), {
    ssr: false,
    loading: () => <div className="hidden" />
})
import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { QRCodeCanvas } from 'qrcode.react'
import { StationTracker } from '@/components/station-tracker'

export default function OperacionesPage() {
    const { t } = useTranslation()
    const { orders, isLoading, summary, updateStatus, createOrder, isCreating, moveToStation } = useOperations()
    const [isScannerOpen, setIsScannerOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<'all' | 'green' | 'amber' | 'red'>('all')
    const [stationFilter, setStationFilter] = useState<string | 'all'>('all')

    const [selectedOrderForQR, setSelectedOrderForQR] = useState<string | null>(null)

    const handleScanComplete = useCallback((data: string) => {
        setIsScannerOpen(false)

        // Check if data is an existing Order ID
        const existingOrder = orders.find(o => o.id === data || o.qrCode.includes(data))

        if (existingOrder) {
            // Find next station
            const currentIdx = ['est-1', 'est-2', 'est-3'].indexOf(existingOrder.currentStationId)
            const nextStationId = ['est-1', 'est-2', 'est-3'][currentIdx + 1]

            if (nextStationId) {
                moveToStation({ orderId: existingOrder.id, stationId: nextStationId })
                toast.success(`${t('operations.syncAchieved')}: ${existingOrder.id} ${t('operations.movedToNext')}`, {
                    description: t('operations.sophiaUpdated'),
                    icon: <CheckCircle2 className="text-emerald-500" />
                })
            } else {
                toast.info(`${t('operations.batch')} ${existingOrder.id} ${t('operations.alreadyInFinal')}`, {
                    description: t('operations.symmetryComplete')
                })
            }
        } else {
            // Create new order if not found
            createOrder({
                customer: `${t('operations.batch')} ${data.substring(0, 8)}`,
                product: 'Cuero Prara Premium',
                quantity: Math.floor(Math.random() * 500) + 100,
                unit: 'SF'
            })
            toast.success(t('operations.newBatchIdentified'), {
                description: t('operations.sophiaRegistered')
            })
        }
    }, [orders, createOrder, moveToStation])

    const filteredOrders = orders.filter(o => {
        const statusMatch = activeFilter === 'all' ? true : o.status === activeFilter
        const stationMatch = stationFilter === 'all' ? true : o.currentStationId === stationFilter
        return statusMatch && stationMatch
    })

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="warning" className="mb-2">{t('operations.activeOperation')}</Badge>
                    <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-[var(--foreground)] leading-tight">
                        {t('operations.title')}
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-lg font-medium transition-colors">{t('operations.subtitle')}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="flex bg-[var(--secondary)]/50 p-1.5 rounded-full border border-[var(--border)] overflow-x-auto scrollbar-hide max-w-full sm:max-w-none">
                        {(['all', 'green', 'amber', 'red'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all",
                                    activeFilter === f
                                        ? "bg-[var(--foreground)] text-[var(--background)] shadow-sm"
                                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                )}
                            >
                                {f === 'all' ? t('operations.filterAll') : f === 'green' ? t('operations.filterReady') : f === 'amber' ? t('operations.filterProcess') : t('operations.filterUrgent')}
                            </button>
                        ))}
                    </div>
                    <Button
                        onClick={() => setIsScannerOpen(true)}
                        disabled={isCreating}
                        className="!rounded-full shadow-lg shadow-blue-500/20 px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white border-none font-black tracking-widest"
                    >
                        <QrCode size={20} className="mr-3" />
                        {isCreating ? t('operations.synchronizing') : t('operations.sophiaEye')}
                    </Button>
                </div>
            </div>

            <SophiaEye
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleScanComplete}
            />

            <StationTracker
                orders={orders}
                onStationClick={(id) => setStationFilter(prev => prev === id ? 'all' : id)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <Card className="lg:col-span-8 p-10 space-y-8 border-none ring-1 ring-[var(--border)] shadow-sm">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-[var(--foreground)] text-xl tracking-tight">{t('operations.batchInProcess')}</h3>
                            {stationFilter !== 'all' && (
                                <Badge variant="default" className="bg-blue-500/10 text-blue-500 border border-blue-500/20 lowercase">
                                    {t('operations.station')}: {stationFilter === 'est-1' ? t('operations.reception') : stationFilter === 'est-2' ? t('operations.split') : t('operations.shaved')}
                                    <button onClick={() => setStationFilter('all')} className="ml-2 hover:text-[var(--foreground)]">×</button>
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-sm font-bold text-[var(--muted-foreground)]">
                                {isLoading ? t('common.loading') : `${orders.length} ${t('operations.activeBatches')}`}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-[20px]" />
                            ))
                        ) : (
                            <AnimatePresence mode="popLayout" initial={false}>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={order.id}
                                            className="group relative p-5 sm:p-6 lg:p-7 bg-[var(--secondary)]/30 rounded-[32px] hover:bg-[var(--secondary)]/60 transition-all cursor-pointer border border-white/5 hover:border-blue-500/20 shadow-sm hover:shadow-blue-500/10 overflow-hidden"
                                        >
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-8">
                                                {/* Left: Icon Component */}
                                                <div className={cn(
                                                    "w-14 h-14 sm:w-16 sm:h-16 rounded-[22px] flex items-center justify-center shadow-xl shrink-0 transition-transform group-hover:scale-110 duration-500 mx-auto sm:mx-0",
                                                    order.status === 'green' ? "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20" :
                                                        order.status === 'amber' ? "bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20" :
                                                            "bg-red-500/10 text-red-500 ring-1 ring-red-500/20"
                                                )}>
                                                    <QrCode className="w-7 h-7 sm:w-8 sm:h-8" />
                                                </div>

                                                {/* Center: Main Info Column */}
                                                <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2">
                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 w-full">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-blue-500/60 uppercase">{t('operations.batchId')}</span>
                                                            <p className="font-bold text-[var(--foreground)] text-[10px] sm:text-xs tracking-tight">{order.id}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-[var(--foreground)]/5 px-2 py-0.5 rounded-full border border-[var(--foreground)]/5 shrink-0">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                            <span className="text-[8px] sm:text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest italic leading-none truncate">
                                                                {order.currentStationId === 'est-1' ? t('operations.reception') : order.currentStationId === 'est-2' ? t('operations.split') : t('operations.shaved')}
                                                            </span>
                                                        </div>
                                                        <div className="sm:hidden w-full flex justify-center mt-1">
                                                            <Badge
                                                                className={cn(
                                                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-none transition-colors",
                                                                    order.status === 'green' ? "bg-blue-500/10 text-blue-500" :
                                                                        order.status === 'amber' ? "bg-blue-400/10 text-blue-400" :
                                                                            "bg-red-500/10 text-red-500"
                                                                )}
                                                            >
                                                                {order.status === 'green' ? t('operations.optimized') : order.status === 'amber' ? t('operations.transition') : t('operations.delayed')}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <h4 className="text-2xl sm:text-[24px] lg:text-[28px] font-black text-[var(--foreground)] tracking-tight leading-none group-hover:text-blue-500 transition-colors duration-300 truncate w-full">
                                                        {order.customer}
                                                    </h4>

                                                    <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center sm:justify-start">
                                                        <div className="flex items-center bg-[var(--foreground)]/5 px-2 py-0.5 rounded-lg">
                                                            <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-[var(--muted-foreground)]">{order.product}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] sm:text-[10px] font-black text-[var(--muted-foreground)]/40 uppercase tracking-widest leading-none pt-0.5">Volumen</span>
                                                            <span className="text-sm sm:text-base font-black text-blue-500 leading-none">{order.quantity} {order.unit}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Actions */}
                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-center gap-3 sm:gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5 sm:shrink-0 w-full sm:w-auto">
                                                    <div className="hidden sm:block">
                                                        <Badge
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none transition-all shadow-sm",
                                                                order.status === 'green' ? "bg-blue-500/10 text-blue-500" :
                                                                    order.status === 'amber' ? "bg-blue-400/10 text-blue-400" :
                                                                        "bg-red-500/10 text-red-500"
                                                            )}
                                                        >
                                                            {order.status === 'green' ? t('operations.optimized') : order.status === 'amber' ? t('operations.transition') : t('operations.delayed')}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setSelectedOrderForQR(order.id)
                                                            }}
                                                            className="h-12 w-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--secondary)] sm:bg-white/5 border border-[var(--border)] sm:border-white/10 flex items-center justify-center text-[var(--foreground)] hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm shrink-0"
                                                            title={t('operations.viewQR')}
                                                        >
                                                            <QrCode size={20} className="sm:size-6" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                const nextStatus = order.status === 'red' ? 'amber' : order.status === 'amber' ? 'green' : 'red'
                                                                updateStatus({ orderId: order.id, status: nextStatus })
                                                            }}
                                                            className="h-12 w-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--secondary)] sm:bg-white/5 border border-[var(--border)] sm:border-white/10 flex items-center justify-center text-[var(--foreground)] hover:bg-white hover:text-black transition-all duration-300 shadow-sm group/btn shrink-0"
                                                        >
                                                            <ArrowRight size={18} className="sm:size-6 group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-20 h-20 rounded-[32px] bg-[var(--secondary)] flex items-center justify-center text-[var(--muted-foreground)] border border-[var(--border)]">
                                            <Package size={32} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-[var(--foreground)] tracking-tight">{t('operations.noBatches')}</p>
                                            <p className="text-sm text-[var(--muted-foreground)] font-medium">{t('operations.useCamera')}</p>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </Card>

                <div className="lg:col-span-4 space-y-8">
                    <Card className="bg-[var(--foreground)] text-[var(--background)] p-10 space-y-8 border-none shadow-xl relative overflow-hidden transition-colors duration-500">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -ml-16 -mt-16" />
                        <h3 className="font-bold text-xl tracking-tight relative z-10 text-balance">{t('operations.stationDirectory')}</h3>
                        <div className="space-y-8 relative z-10">
                            {[
                                { id: 'est-1', n: `${t('operations.station')} 1: ${t('operations.reception')}`, i: CheckCircle2, c: 'text-blue-500', s: t('operations.entry') },
                                { id: 'est-2', n: `${t('operations.station')} 2: ${t('operations.split')}`, i: Play, c: 'text-red-500', s: t('operations.filterProcess') },
                                { id: 'est-3', n: `${t('operations.station')} 3: ${t('operations.shaved')}`, i: Clock, c: 'text-blue-400', s: t('operations.final') },
                            ].map((s, idx) => {
                                const count = orders.filter(o => o.currentStationId === s.id).length
                                return (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <div className="flex gap-4">
                                            <div className={cn("p-1.5 rounded-[8px] bg-[var(--background)]/5", s.c)}>
                                                <s.i size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-bold text-[var(--background)]">{s.n}</p>
                                                <p className="text-[11px] font-bold text-[var(--background)]/40 uppercase tracking-widest mt-0.5">{s.s}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-[var(--background)]">{count}</p>
                                            <p className="text-[9px] font-bold text-[var(--background)]/20 uppercase tracking-tighter">{t('operations.batches')}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="pt-8 border-t border-[var(--background)]/10 relative z-10">
                            <p className="text-sm text-[var(--background)]/50 mb-8 font-medium leading-relaxed italic">
                                "{t('sophia.subtitle')}"
                            </p>
                            <Button variant="secondary" className="w-full !bg-[var(--background)]/10 !text-[var(--background)] !border-[var(--background)]/10 hover:!bg-[var(--background)]/20 !rounded-[16px] h-12 font-bold">
                                {t('operations.optimizeFlow')}
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-8 border-none ring-1 ring-blue-500/20 bg-blue-500/5 shadow-sm space-y-6">
                        <h4 className="font-bold text-[var(--foreground)] tracking-widest text-xs">{t('operations.summary')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-wider">{t('operations.completed')}</p>
                                <p className="text-2xl font-bold text-[var(--foreground)]">{summary?.completedToday || 0}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-wider">{t('operations.active')}</p>
                                <p className="text-2xl font-bold text-[var(--foreground)]">{summary?.activeOrders || 0}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-none ring-1 ring-blue-500/20 bg-blue-500/5 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                                <Package size={16} />
                            </div>
                            <h4 className="font-bold text-[var(--foreground)] tracking-wider text-[10px]">{t('operations.trainingMaterial')}</h4>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                            {t('operations.trainingDesc')}
                        </p>
                        <div className="pt-2">
                            <img
                                src="/order-qr-sample.png"
                                alt="QR Lote Maestro"
                                className="w-full aspect-square rounded-xl bg-white p-4 shadow-inner cursor-zoom-in hover:scale-[1.02] transition-transform"
                                onClick={() => setSelectedOrderForQR('LOTE-MAESTRO')}
                            />
                            <p className="text-center text-[9px] font-bold text-blue-500 mt-2 tracking-widest">{t('operations.syncPrimordial')}</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* QR View Modal */}
            <AnimatePresence>
                {selectedOrderForQR && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
                        onClick={() => setSelectedOrderForQR(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[var(--card)] p-12 rounded-[40px] border border-white/10 shadow-2xl max-w-sm w-full text-center relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">{t('operations.syncLabel')}</h3>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-8">{selectedOrderForQR}</p>

                            <div className="bg-white p-8 rounded-[32px] inline-block mb-8 shadow-inner">
                                <QRCodeCanvas
                                    value={selectedOrderForQR}
                                    size={200}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>

                            <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-8">
                                {t('operations.syncInstruction')}
                            </p>

                            <Button
                                onClick={() => setSelectedOrderForQR(null)}
                                className="w-full !rounded-2xl h-14 bg-white text-black font-bold"
                            >
                                {t('operations.understood')}
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
