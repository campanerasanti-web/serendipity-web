export type ClimateIcon = 'sun' | 'waves' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'zap' | 'desert';
export type Season = 'COSECHA' | 'SIEMBRA' | 'SEQUÍA' | 'TORMENTA';

export interface FinancialClimate {
    icon: ClimateIcon;
    season: Season;
    message: string;
    weatherClass: string;
    liquidityLevel: 'ALTA' | 'MEDIA' | 'BAJA' | 'CRÍTICA';
    flowTrend: 'SUBIENDO' | 'ESTABLE' | 'BAJANDO';
}

export interface ExpenseCategory {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface FinanceSummary {
    totalBalance: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    netProfit: number;
    profitMargin: number;
    reserveFund: number;
    reserveTarget: number;
    debtRemaining: number;
    debtTotal: number;
    climate: FinancialClimate;
    expensesByCategory: ExpenseCategory[];
}
