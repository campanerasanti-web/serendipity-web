'use client'

import React from 'react'
import { Card, Badge } from './ui-library'
import { CheckCircle2, Play, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Order } from '@/types/operations'
import { useTranslation } from '@/context/language-context'

interface Station {
    id: string
    name: string
    description: string
    icon: any
    color: string
}

export function StationTracker({ orders, onStationClick }: { orders: Order[], onStationClick?: (stationId: string) => void }) {
    const { t } = useTranslation()
    const getCount = (id: string) => orders.filter(o => o.currentStationId === id).length

    const STATIONS: Station[] = [
        { id: 'est-1', name: t('operations.reception'), description: t('operations.receptionDesc'), icon: CheckCircle2, color: 'text-blue-500' },
        { id: 'est-2', name: t('operations.split'), description: t('operations.splitDesc'), icon: Play, color: 'text-blue-500' },
        { id: 'est-3', name: t('operations.shaved'), description: t('operations.shavedDesc'), icon: Clock, color: 'text-blue-500' },
    ]

    return (
        <Card bio className="p-8 border-none ring-1 ring-[var(--climate-border)] shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight">{t('operations.physicalSyncMap')}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] font-medium">{t('operations.stationDistribution')}</p>
                </div>
                <Badge variant="success">{t('common.realtime')}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {STATIONS.map((station, idx) => {
                    const count = getCount(station.id)
                    const isLast = idx === STATIONS.length - 1

                    return (
                        <div key={station.id} className="relative flex flex-col items-center">
                            <motion.div
                                onClick={() => onStationClick?.(station.id)}
                                whileHover={{ scale: 1.02 }}
                                className={cn(
                                    "w-full p-6 rounded-[28px] border transition-all duration-500 cursor-pointer group",
                                    count > 0 ? "bg-[var(--secondary)]/40 border-[var(--climate-primary)]/20 shadow-lg shadow-[var(--climate-glow)]" : "bg-transparent border-[var(--border)] opacity-60"
                                )}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("p-2 rounded-xl bg-[var(--background)] shadow-sm", station.color)}>
                                        <station.icon size={20} />
                                    </div>
                                    <span className="text-2xl font-black text-[var(--foreground)]">{count}</span>
                                </div>
                                <h4 className="font-bold text-[var(--foreground)]">{station.name}</h4>
                                <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mt-1">{station.description}</p>
                            </motion.div>

                            {!isLast && (
                                <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--border)] items-center justify-center text-[var(--muted-foreground)] shadow-sm">
                                    <ArrowRight size={14} />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}
