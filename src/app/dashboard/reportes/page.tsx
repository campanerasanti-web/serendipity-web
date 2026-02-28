'use client'

import { useReports } from '@/hooks/use-reports'
import { Card, Badge, Button, Skeleton } from '@/components/ui-library'
import { Activity, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/context/language-context'
import { PerformanceChart } from '@/components/dashboard/performance-chart'

export default function ReportesPage() {
    const { t } = useTranslation()
    const { data: reportsData, isLoading } = useReports()

    if (isLoading) {
        return (
            <div className="space-y-12">
                <div className="space-y-4">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-64 h-12" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-[30px]" />
                    ))}
                </div>
            </div>
        )
    }

    if (!reportsData) return null

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="default" className="bg-blue-500/10 text-blue-500 border-none mb-2">{t('reports.dataIntelligence')}</Badge>
                    <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight text-[var(--foreground)] leading-tight">
                        {t('reports.title')}
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-lg font-medium">{t('reports.subtitle')}</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" className="!rounded-xl border border-[var(--border)] font-bold text-xs uppercase tracking-widest">{t('reports.filter')}</Button>
                    <Button variant="secondary" className="!rounded-xl font-bold text-xs uppercase tracking-widest px-6">{t('reports.export')}</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <Card className="lg:col-span-8 p-10 space-y-10 border-none ring-1 ring-[var(--border)] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--foreground)] text-xl tracking-tight transition-colors">{t('reports.profitTracker')}</h3>
                                <p className="text-sm text-[var(--muted-foreground)] font-medium transition-colors">{t('reports.avgMargin')}: {reportsData.summary.avgProfitMargin}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-80">
                        <PerformanceChart data={reportsData.historicalMetrics} type="bar" />
                    </div>
                </Card>

                <div className="lg:col-span-4 space-y-8">
                    <Card bio className="p-8 space-y-8 border-none ring-1 ring-[var(--border)] shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            <h4 className="font-bold text-[var(--foreground)] text-lg tracking-tight">{t('reports.growthTrend')}</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: t('reports.totalVolume'), value: `${reportsData.summary.totalVolume.toLocaleString()} SF`, trend: `+${reportsData.summary.growthRate}%` },
                                { label: t('reports.opEfficiency'), value: '94.2%', trend: '+3.1%' },
                                { label: t('reports.monthlyGrowth'), value: '18.4%', trend: '+5.5%' },
                            ].map((stat, idx) => (
                                <div key={idx} className="flex justify-between items-end border-b border-[var(--border)] pb-4 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-xl font-bold text-[var(--foreground)]">{stat.value}</p>
                                    </div>
                                    <span className="text-blue-500 font-bold text-sm mb-1">{stat.trend}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card glass className="p-8 space-y-6 border-none ring-1 ring-blue-500/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="flex items-center gap-3">
                            <Sparkles size={18} className="text-blue-500" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600">{t('reports.sophiaInsights')}</span>
                        </div>
                        <div className="space-y-4">
                            {reportsData.insights.map((insight, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-[20px] bg-[var(--card)] border border-[var(--border)] group-hover:border-blue-500/20 transition-all">
                                    <div className={cn("w-1.5 h-1.5 rounded-full mt-2 border border-transparent shrink-0", insight.type === 'RISK' ? 'bg-red-500' : 'bg-blue-500')} />
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider">
                                            {(t as any)(`dataInsights.${insight.id}.title`)}
                                        </p>
                                        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed font-medium">
                                            {(t as any)(`dataInsights.${insight.id}.desc`)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 !rounded-xl h-12">
                            {t('reports.generateAnalysis')}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
