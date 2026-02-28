'use client'

import { TrendingUp, ShieldCheck, Sun, Waves, CloudSun, Cloud, CloudRain, Zap, Trees as Desert } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

import { useFinance } from '@/hooks/use-finance'
import { Card, Badge, Button, Skeleton } from '@/components/ui-library'
import { ClimateIcon } from '@/types/finance'
import { useTranslation } from '@/context/language-context'

const ClimateIconMap = ({ icon, className }: { icon: ClimateIcon, className?: string }) => {
    switch (icon) {
        case 'sun': return <Sun className={className} />
        case 'waves': return <Waves className={className} />
        case 'cloud-sun': return <CloudSun className={className} />
        case 'cloud': return <Cloud className={className} />
        case 'cloud-rain': return <CloudRain className={className} />
        case 'zap': return <Zap className={className} />
        case 'desert': return <Desert className={className} />
        default: return <Sun className={className} />
    }
}

export default function FinanzasPage() {
    const { t } = useTranslation()
    const { data: finData, isLoading } = useFinance()

    if (isLoading) {
        return (
            <div className="space-y-12">
                <div className="space-y-4">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-64 h-12" />
                    <Skeleton className="w-96 h-6" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Skeleton className="h-80 rounded-[30px]" />
                    <Skeleton className="h-80 rounded-[30px]" />
                </div>
            </div>
        )
    }

    if (!finData) return null

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="success" className="mb-2">{t('finances.solvencyGuarantee')}</Badge>
                    <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-[var(--foreground)] leading-tight">
                        {t('finances.title')}
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-lg font-medium">{t('finances.subtitle')}</p>
                </div>
                <Card className="!bg-[var(--card)] !py-3 !px-6 border-none ring-1 ring-[var(--border)] shadow-sm flex items-center justify-center gap-3 w-full lg:w-auto">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest leading-none pt-0.5">{t('finances.leaderAccess')}</span>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="p-10 space-y-10 border-none ring-1 ring-[var(--border)] shadow-sm overflow-hidden relative">
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 z-0", finData.climate.weatherClass)} />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-[14px]">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--foreground)] text-xl tracking-tight transition-colors">{t('finances.reserveFund')}</h3>
                            <p className="text-sm text-[var(--muted-foreground)] font-medium whitespace-nowrap">{t('finances.projectedBacking')}</p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-end">
                            <p className="text-4xl font-bold text-[var(--foreground)] tracking-tighter">${finData.reserveFund.toLocaleString()}</p>
                            <p className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{t('finances.target')}: ${finData.reserveTarget.toLocaleString()}</p>
                        </div>
                        <div className="h-5 bg-[var(--secondary)] rounded-full overflow-hidden shadow-inner border border-[var(--border)] p-1">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(finData.reserveFund / finData.reserveTarget) * 100}%` }}
                                transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                                className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-600/20"
                            />
                        </div>
                        <div className="flex items-start gap-4 p-5 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--border)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity -mr-4 -mt-4">
                                <ClimateIconMap icon={finData.climate.icon} className="w-24 h-24 rotate-12" />
                            </div>
                            <div className="p-2 bg-[var(--foreground)]/10 rounded-lg text-[var(--foreground)] shrink-0">
                                <ClimateIconMap icon={finData.climate.icon} className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-[var(--muted-foreground)] font-medium leading-relaxed pt-0.5 relative z-10">
                                {finData.climate.message}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-10 space-y-10 border-none bg-[var(--foreground)] text-[var(--background)] shadow-2xl relative overflow-hidden transition-colors duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-[var(--background)]/10 text-blue-400 rounded-[14px]">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl tracking-tight transition-colors">{t('finances.amortization')}</h3>
                            <p className="text-sm text-[var(--background)]/40 font-medium">{t('finances.debtSchedule')}</p>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-end">
                            <p className="text-4xl font-bold tracking-tighter transition-colors">${finData.debtRemaining.toLocaleString()}</p>
                            <div className="text-right">
                                <p className="text-xs font-bold text-[var(--background)]/40 uppercase tracking-widest mb-1">{t('finances.remainingOf')}</p>
                                <p className="text-[15px] font-bold text-[var(--background)]/60">${finData.debtTotal.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="h-5 bg-[var(--background)]/5 rounded-full overflow-hidden border border-[var(--background)]/10 p-1">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(1 - finData.debtRemaining / finData.debtTotal) * 100}%` }}
                                transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
                                className="h-full bg-red-500 rounded-full shadow-lg shadow-red-500/40"
                            />
                        </div>
                        <div className="pt-6">
                            <Button variant="secondary" className="w-full !bg-[var(--background)]/10 !text-[var(--background)] !border-[var(--background)]/10 hover:!bg-[var(--background)]/20 h-14 !rounded-[20px] font-bold transition-all">
                                {t('finances.analyzePlan')}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Expenses Breakdown */}
            <Card className="p-10 border-none ring-1 ring-[var(--border)] shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <h4 className="font-bold text-[var(--foreground)] text-lg tracking-tight">{t('finances.expenseStructure')}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {finData.expensesByCategory.map((exp) => (
                        <div key={exp.category} className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-[var(--muted-foreground)]">{exp.category}</span>
                                <span className="text-[var(--foreground)]">${exp.amount.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${exp.percentage}%` }}
                                    className={cn("h-full rounded-full", exp.color)}
                                />
                            </div>
                            <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{exp.percentage}% {t('finances.totalOf')}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
