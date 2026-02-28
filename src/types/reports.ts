export interface ReportMetric {
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
    efficiency: number;
}

export interface ReportInsight {
    id: string;
    title: string;
    description: string;
    type: 'OPTIMIZATION' | 'RISK' | 'OPPORTUNITY';
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ReportData {
    historicalMetrics: ReportMetric[];
    insights: ReportInsight[];
    summary: {
        avgProfitMargin: number;
        totalVolume: number;
        growthRate: number;
    };
}
