import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { OperationsService } from '@/services/operations.service'
import { Order } from '@/types/operations'
import { toast } from 'sonner'

export const useOperations = () => {
    const queryClient = useQueryClient()

    const ordersQuery = useQuery({
        queryKey: ['orders'],
        queryFn: () => OperationsService.getOrders(),
        staleTime: 1000 * 30, // 30 seconds
    })

    const summaryQuery = useQuery({
        queryKey: ['orders-summary'],
        queryFn: () => OperationsService.getSummary(),
        staleTime: 1000 * 60, // 1 minute
    })

    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, status, reason }: { orderId: string, status: Order['status'], reason?: string }) =>
            OperationsService.updateStatus(orderId, status, reason),
        onSuccess: (updatedOrder) => {
            queryClient.setQueryData(['orders'], (old: Order[] | undefined) => {
                if (!old) return [updatedOrder]
                return old.map(o => o.id === updatedOrder.id ? updatedOrder : o)
            })
            toast.success(`Orden ${updatedOrder.id} actualizada a ${updatedOrder.status}`)
        },
        onError: () => {
            toast.error('Error al actualizar el estado de la orden')
        }
    })

    const createOrderMutation = useMutation({
        mutationFn: (order: Partial<Order>) => OperationsService.createOrder(order),
        onSuccess: (newOrder) => {
            queryClient.setQueryData(['orders'], (old: Order[] | undefined) => {
                if (!old) return [newOrder]
                return [newOrder, ...old]
            })
            toast.success(`Lote ${newOrder.id} escaneado correctamente`)
        }
    })

    const moveStationMutation = useMutation({
        mutationFn: ({ orderId, stationId }: { orderId: string, stationId: string }) =>
            OperationsService.moveToStation(orderId, stationId),
        onSuccess: (updatedOrder) => {
            queryClient.setQueryData(['orders'], (old: Order[] | undefined) => {
                if (!old) return [updatedOrder]
                return old.map(o => o.id === updatedOrder.id ? updatedOrder : o)
            })
            const stationName = updatedOrder.currentStationId === 'est-1' ? 'Recepción' : updatedOrder.currentStationId === 'est-2' ? 'Dividido' : 'Rebajado'
            toast.success(`${updatedOrder.id} movido a ${stationName}`)
        }
    })

    return {
        orders: ordersQuery.data || [],
        isLoading: ordersQuery.isLoading,
        summary: summaryQuery.data,
        updateStatus: updateStatusMutation.mutate,
        isUpdating: updateStatusMutation.isPending,
        createOrder: createOrderMutation.mutate,
        isCreating: createOrderMutation.isPending,
        moveToStation: moveStationMutation.mutate,
        isMoving: moveStationMutation.isPending
    }
}
