'use client'

import React from 'react';
import {
    Zap,
    Wind,
    Layers,
    Activity,
    RefreshCcw,
    Sun,
    Compass,
    Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from './ui-library';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/language-context';

interface Principle {
    name: string;
    frequency: number;
    chakra: string;
    health: number;
    color: string;
    emoji: string;
    icon: any;
    description: string;
}

export function SystemSymmetryPanel({
    systemHealths,
    overallHealth = 73,
    onActivate
}: {
    systemHealths?: Record<string, number>;
    overallHealth?: number;
    onActivate?: () => void;
}) {
    const { t } = useTranslation()

    const PRINCIPLES: Record<string, Principle> = {
        mentalismo: {
            name: t('sophia.principles.mentalism'),
            frequency: 963,
            chakra: t('sophia.chakras.crown'),
            health: 70,
            color: 'text-blue-500',
            emoji: '👑',
            icon: Sparkles,
            description: t('sophia.principles.mentalismDesc')
        },
        correspondencia: {
            name: t('sophia.principles.correspondence'),
            frequency: 852,
            chakra: t('sophia.chakras.thirdEye'),
            health: 95,
            color: 'text-blue-400',
            emoji: '💎',
            icon: Layers,
            description: t('sophia.principles.correspondenceDesc')
        },
        vibracion: {
            name: t('sophia.principles.vibration'),
            frequency: 741,
            chakra: t('sophia.chakras.throat'),
            health: 60,
            color: 'text-blue-600',
            emoji: '🌊',
            icon: Activity,
            description: t('sophia.principles.vibrationDesc')
        },
        polaridad: {
            name: t('sophia.principles.polarity'),
            frequency: 639,
            chakra: t('sophia.chakras.heart'),
            health: 85,
            color: 'text-red-500',
            emoji: '⚖️',
            icon: Zap,
            description: t('sophia.principles.polarityDesc')
        },
        ritmo: {
            name: t('sophia.principles.rhythm'),
            frequency: 528,
            chakra: t('sophia.chakras.solarPlexus'),
            health: 75,
            color: 'text-blue-500',
            emoji: '⏳',
            icon: RefreshCcw,
            description: t('sophia.principles.rhythmDesc')
        },
        causalidad: {
            name: t('sophia.principles.causality'),
            frequency: 417,
            chakra: t('sophia.chakras.sacral'),
            health: 80,
            color: 'text-red-600',
            emoji: '🏹',
            icon: Compass,
            description: t('sophia.principles.causalityDesc')
        },
        generacion: {
            name: t('sophia.principles.generation'),
            frequency: 396,
            chakra: t('sophia.chakras.root'),
            health: 50,
            color: 'text-red-500',
            emoji: '🌱',
            icon: Sun,
            description: t('sophia.principles.generationDesc')
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">{t('sophia.systemSymmetry')}</h2>
                    <p className="text-xs font-medium text-[var(--muted-foreground)]">{t('sophia.digitalBodyHarmony')}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-5xl font-extralight text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">{overallHealth}</span>
                    <span className="text-[10px] font-bold text-[var(--muted-foreground)] tracking-wider">{t('sophia.globalCoherence')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(PRINCIPLES).map(([key, p], index) => {
                    const health = systemHealths ? systemHealths[key] : p.health;
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card glass className="relative group overflow-hidden border-white/5 hover:border-white/10 transition-all duration-500">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full -mr-16 -mt-16 pointer-events-none" />

                                <div className="flex justify-between items-center mb-6">
                                    <div className={cn("p-2.5 rounded-xl bg-white/5", p.color)}>
                                        <p.icon size={20} />
                                    </div>
                                    <Badge variant="default" className="font-mono text-[10px] opacity-70 tracking-tighter">
                                        {p.frequency} Hz
                                    </Badge>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-base font-bold text-[var(--foreground)] tracking-tight mb-1">{p.name}</h3>
                                        <p className="text-[11px] font-medium text-[var(--muted-foreground)] leading-relaxed h-8 line-clamp-2">
                                            {p.description}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${health}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className={cn("h-full rounded-full bg-blue-500")}
                                                style={{ backgroundColor: p.color.includes('[#') ? p.color.match(/\[(.*?)\]/)?.[1] : undefined }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">{p.chakra}</span>
                                            <span className={cn("text-xs font-bold", health < 60 ? "text-red-500" : "text-blue-500")}>
                                                {health}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex flex-col items-center gap-6 pt-8 border-t border-white/5">
                <Button
                    variant="secondary"
                    onClick={onActivate}
                    className="bg-white text-black hover:bg-white/90 rounded-full px-10 h-12 text-xs font-black tracking-widest shadow-xl shadow-white/10"
                >
                    <RefreshCcw size={16} className="mr-3" />
                    {t('sophia.executeActivation')}
                </Button>
                <p className="text-[11px] italic text-[var(--muted-foreground)] opacity-50">
                    "{t('sophia.hermeticAxiom')}"
                </p>
            </div>
        </div>
    );
}
