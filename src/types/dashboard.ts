export interface DashboardStats {
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
    profitMargin: number;
    totalCustomers: number;
    errorRate: number;
    onTimeDeliveryRate: number;
}

export interface MetricDay {
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
    transactions: number;
}

export interface FinancialTrend {
    status: 'subiendo' | 'bajando' | 'estable';
    liquidityLevel: 'alta' | 'media' | 'baja' | 'critica';
    season: 'cosecha' | 'siembra' | 'sequia' | 'tormenta';
    messageOfTheDay: string;
}

export interface RecommendationItem {
    priority: number;
    title: string;
    timeline: string;
    description: string;
    impact: string;
    ethicalAlignment: string;
    actions: string[];
}

export interface AlertItem {
    severity: 'CRITICAL' | 'HIGH' | 'OPPORTUNITY' | 'INFO';
    category: string;
    message: string;
    recommendation: string;
    injusticeType?: string;
}

export interface TeamMember {
    name: string;
    role: string;
    salary: number;
    tier: string;
    valueContribution: number;
    equityScore: number;
}

export interface DashboardData {
    stats: DashboardStats;
    metrics: MetricDay[];
    trend: FinancialTrend;
    recommendations: RecommendationItem[];
    alerts: AlertItem[];
    team: TeamMember[];
}
