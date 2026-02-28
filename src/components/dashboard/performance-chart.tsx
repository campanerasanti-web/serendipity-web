'use client'

import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts'
import { useTranslation } from '@/context/language-context'

interface PerformanceChartProps {
    data: any[]
    type?: 'area' | 'bar'
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-lg shadow-xl backdrop-blur-md">
                <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-black text-amber-500">
                    {payload[0].value}% <span className="text-[10px] text-[var(--muted-foreground)] font-medium">Profit</span>
                </p>
            </div>
        )
    }
    return null
}

export function PerformanceChart({ data, type = 'area' }: PerformanceChartProps) {
    const { t } = useTranslation()

    // Transform data if needed (assuming metrics has { date, profit })
    const chartData = data.map(d => ({
        name: d.date.includes('-') ? d.date.split('-').slice(-2).join('/') : d.date,
        value: d.profit
    }))

    if (type === 'bar') {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<CustomTooltip />} />
                    <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        fill="url(#barGradient)"
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fillOpacity={0.7}
                                className="hover:fill-opacity-100 transition-all duration-300"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                />
                <YAxis
                    hide
                    domain={[0, 'dataMax + 10']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    animationDuration={1500}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
