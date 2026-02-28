import { useQuery } from '@tanstack/react-query'
import { FinanceService } from '@/services/finance.service'

export function useFinance() {
    return useQuery({
        queryKey: ['finance-summary'],
        queryFn: () => FinanceService.getSummary(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
