import { FinanceSummary, FinancialClimate } from '@/types/finance';

// Mock data based on Serendipity Bros records
const MOCK_FINANCE: FinanceSummary = {
    totalBalance: 24500,
    monthlyRevenue: 12500,
    monthlyExpenses: 8200,
    netProfit: 4300,
    profitMargin: 34.4,
    reserveFund: 21000,
    reserveTarget: 41000,
    debtRemaining: 15000,
    debtTotal: 40000,
    climate: {
        icon: 'sun',
        season: 'COSECHA',
        message: 'Días de sol. El sistema respira tranquilo bajo cielos despejados.',
        weatherClass: 'from-blue-500/10 to-transparent',
        liquidityLevel: 'ALTA',
        flowTrend: 'ESTABLE'
    },
    expensesByCategory: [
        { category: 'Planta & Energía', amount: 3200, percentage: 39, color: 'bg-[var(--foreground)]' },
        { category: 'Recursos Humanos', amount: 2800, percentage: 34, color: 'bg-blue-500' },
        { category: 'Insumos de Proceso', amount: 1200, percentage: 15, color: 'bg-red-500' },
        { category: 'Otros', amount: 1000, percentage: 12, color: 'bg-[var(--secondary)]' },
    ]
};

export class FinanceService {
    static async getSummary(): Promise<FinanceSummary> {
        // Simulating API Latency
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_FINANCE), 150);
        });
    }

    static calculateClimate(revenue: number, expenses: number, balance: number): FinancialClimate {
        const ratio = balance / (expenses || 1);

        if (ratio >= 3) {
            return {
                icon: 'waves',
                season: 'COSECHA',
                message: 'Época de cosecha. Los ríos fluyen con abundancia.',
                weatherClass: 'from-blue-500/10 to-transparent',
                liquidityLevel: 'ALTA',
                flowTrend: 'SUBIENDO'
            };
        }

        if (ratio >= 0.5) {
            return {
                icon: 'sun',
                season: 'SIEMBRA',
                message: 'Tiempo de siembra. Preparando el terreno para el crecimiento.',
                weatherClass: 'from-blue-500/10 to-transparent',
                liquidityLevel: 'MEDIA',
                flowTrend: 'ESTABLE'
            };
        }

        return {
            icon: 'zap',
            season: 'TORMENTA',
            message: 'Tormenta inminente. El sistema exige acción inmediata.',
            weatherClass: 'from-red-500/10 to-transparent',
            liquidityLevel: 'CRÍTICA',
            flowTrend: 'BAJANDO'
        };
    }
}
