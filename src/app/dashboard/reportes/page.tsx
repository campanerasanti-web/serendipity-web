'use client'

import { useReports } from '@/hooks/use-reports'
import { Card, Badge, Button, Skeleton } from '@/components/ui-library'
import { Activity, Sparkles, TrendingUp, AlertTriangle, Filter, Download, RefreshCcw, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/context/language-context'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/date-range-picker'

import { exportToPDF } from '@/lib/pdf-utils'
import { useNotifications } from '@/context/notification-context'

export default function ReportesPage() {
    const { t } = useTranslation()
    const { addNotification } = useNotifications()
    const [date, setDate] = useState<DateRange | undefined>()
    const { data: reportsData, isLoading } = useReports(date)
    const [isExporting, setIsExporting] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisProgress, setAnalysisProgress] = useState(0)

    const handleSophiaAnalysis = async () => {
        setIsAnalyzing(true)
        setAnalysisProgress(0)
        
        // Simular análisis profundo
        const interval = setInterval(() => {
            setAnalysisProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 5
            })
        }, 150)

        setTimeout(() => {
            setIsAnalyzing(false)
            setAnalysisProgress(0)
            addNotification({
                type: 'SUCCESS',
                title: 'Análisis Completo',
                message: 'Sophia ha detectado 3 patrones críticos en el flujo de caja operativo.'
            })
        }, 4000)
    }

    const handleExport = async () => {
        setIsExporting(true)
        const promise = exportToPDF('reports-content', 'Serendipity_Reporte_Rendimiento.pdf')
        
        addNotification({
            type: 'INFO',
            title: 'Generando Reporte',
            message: 'Estamos preparando tu documento de alta fidelidad...'
        })

        try {
            await promise
            addNotification({
                type: 'SUCCESS',
                title: 'Exportación Exitosa',
                message: 'El reporte ha sido descargado en tu dispositivo.'
            })
        } catch (error) {
            console.error(error)
            addNotification({
                type: 'ERROR',
                title: 'Fallo de Exportación',
                message: 'No pudimos generar el documento en este momento.'
            })
        } finally {
            setIsExporting(false)
        }
    }

    const handleCSVExport = () => {
        if (!reportsData) return
        
        const headers = ['Fecha', 'Rentabilidad (%)']
        const rows = reportsData.historicalMetrics.map(m => [m.date, m.profit])
        
        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `Serendipity_Datos_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        addNotification({
            type: 'SUCCESS',
            title: t('reports.export'),
            message: 'Archivo CSV descargado correctamente.'
        })
    }

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
        <div className="space-y-12" id="reports-content">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <Badge variant="default" className="bg-blue-500/10 text-blue-500 border-none font-medium px-3 py-1 mb-2">
                        {t('reports.dataIntelligence')}
                    </Badge>
                    <h1 className="text-3xl lg:text-[36px] font-semibold tracking-tight text-[var(--foreground)] outline-none" contentEditable suppressContentEditableWarning>
                        {t('reports.title')}
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-base font-medium">{t('reports.subtitle')}</p>
                </div>
                <div className="flex gap-4 no-export">
                    <DateRangePicker
                        date={date}
                        onDateChange={setDate}
                        align="right"
                        className="h-10 shadow-sm [&_button]:h-10"
                    />
                    <Button
                        variant="secondary"
                        onClick={handleCSVExport}
                        className="rounded-[16px] font-medium text-[13px] px-5 h-10 shadow-sm transition-all flex items-center gap-2 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)]"
                    >
                        <FileText size={16} /> CSV
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        disabled={isExporting}
                        className="rounded-[16px] font-medium text-[13px] px-5 h-10 shadow-sm transition-all flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90"
                    >
                        <Download size={16} /> {isExporting ? 'Exportando...' : 'PDF'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                <Card className="lg:col-span-8 p-8 lg:p-10 space-y-8 rounded-[28px] border-none ring-1 ring-[var(--border)] shadow-sm bg-[var(--card)]">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 text-blue-500 rounded-[16px] border border-blue-500/20">
                                <Activity size={20} strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[var(--foreground)] text-xl tracking-tight transition-colors">{t('reports.profitTracker')}</h3>
                                <p className="text-[13px] text-[var(--muted-foreground)] font-medium transition-colors mt-0.5">{t('reports.avgMargin')}: {reportsData.summary.avgProfitMargin}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-80 pt-4">
                        <PerformanceChart data={reportsData.historicalMetrics} type="bar" />
                    </div>
                </Card>

                <div className="lg:col-span-4 space-y-6">
                    <Card bio className="p-8 space-y-8 rounded-[28px] border-none ring-1 ring-[var(--border)] shadow-sm bg-[var(--card)]">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            <h4 className="font-semibold text-[var(--foreground)] text-lg tracking-tight">{t('reports.growthTrend')}</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: t('reports.totalVolume'), value: `${reportsData.summary.totalVolume.toLocaleString()} SF`, trend: `+${reportsData.summary.growthRate}%` },
                                { label: t('reports.opEfficiency'), value: '94.2%', trend: '+3.1%' },
                                { label: t('reports.monthlyGrowth'), value: '18.4%', trend: '+5.5%' },
                            ].map((stat, idx) => (
                                <div key={idx} className="flex justify-between items-end border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-medium text-[var(--muted-foreground)]">{stat.label}</p>
                                        <p className="text-xl font-semibold text-[var(--foreground)] tracking-tight">{stat.value}</p>
                                    </div>
                                    <span className="text-blue-500 font-semibold text-sm mb-1 bg-blue-500/10 px-2 py-0.5 rounded-[8px]">{stat.trend}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card glass className="p-8 space-y-6 rounded-[28px] border-none ring-1 ring-blue-500/20 relative overflow-hidden group bg-blue-500/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[10px] bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Sparkles size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-[13px] font-semibold text-blue-600">{t('reports.sophiaInsights')}</span>
                        </div>
                        <div className="space-y-3">
                            {reportsData.insights.map((insight, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={isAnalyzing ? { opacity: 0.3 } : { opacity: 1 }}
                                    animate={isAnalyzing ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 1 }}
                                    transition={{ duration: 1.5, repeat: isAnalyzing ? Infinity : 0 }}
                                    className="flex gap-4 p-4 rounded-[20px] bg-[var(--card)] border border-[var(--border)] group-hover:border-blue-500/20 transition-all shadow-sm"
                                >
                                    <div className="mt-1">
                                        <div className={cn("w-2 h-2 rounded-full", insight.type === 'RISK' ? 'bg-red-500' : 'bg-blue-500')} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-semibold text-[var(--foreground)]">
                                            {(t as any)(`dataInsights.${insight.id}.title`)}
                                        </p>
                                        <p className="text-[12px] text-[var(--muted-foreground)] leading-relaxed font-medium">
                                            {(t as any)(`dataInsights.${insight.id}.desc`)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {isAnalyzing && (
                            <div className="space-y-2 px-1">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-500">
                                    <span>Análisis en curso...</span>
                                    <span>{analysisProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-blue-500/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-blue-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${analysisProgress}%` }}
                                    />
                                </div>
                                <p className="text-[10px] italic text-[var(--muted-foreground)] text-center animate-pulse">
                                    Sophia está cruzando datos históricos con tendencias de mercado...
                                </p>
                            </div>
                        )}

                        <Button 
                            variant="ghost" 
                            onClick={handleSophiaAnalysis}
                            disabled={isAnalyzing}
                            className={cn(
                                "w-full text-[13px] font-semibold bg-[var(--background)] hover:bg-[var(--secondary)] text-[var(--foreground)] rounded-[16px] h-12 border border-[var(--border)] shadow-sm transition-all",
                                isAnalyzing && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isAnalyzing ? (
                                <div className="flex items-center gap-2">
                                    <RefreshCcw size={16} className="animate-spin" />
                                    Sincronizando...
                                </div>
                            ) : t('reports.generateAnalysis')}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
