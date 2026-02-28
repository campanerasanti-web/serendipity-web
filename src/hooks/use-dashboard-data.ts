import { useQuery } from '@tanstack/react-query'
import { DashboardService } from '@/services/dashboard.service'

export const useDashboardData = () => {
    return useQuery({
        queryKey: ['dashboard-data'],
        queryFn: () => DashboardService.getDashboardData(),
        staleTime: 5 * 60 * 1000, // 5 minutos de caché
    })
}
