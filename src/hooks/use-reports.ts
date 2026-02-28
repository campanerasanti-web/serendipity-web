import { useQuery } from '@tanstack/react-query'
import { ReportsService } from '@/services/reports.service'

export function useReports() {
    return useQuery({
        queryKey: ['reports-data'],
        queryFn: () => ReportsService.getReportData(),
        staleTime: 1000 * 60 * 15, // 15 minutes
    })
}
