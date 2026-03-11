import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { OperationsService } from '@/services/operations.service'
import { Order } from '@/types/operations'
import { useNotifications } from '@/context/notification-context'
import { useTranslation } from '@/context/language-context'
import { useOfflineSync } from '@/context/offline-sync-context'
import { useConnectivity } from '@/context/connectivity-context'

export const useOperations = () => {
    const queryClient = useQueryClient()
    const { addNotification } = useNotifications()
    const { t } = useTranslation()
    const { enqueueAction } = useOfflineSync()
    const { isOnline } = useConnectivity()

    const stationsQuery = useQuery({
        queryKey: ['stations'],
        queryFn: () => OperationsService.getStations(),
        staleTime: 1000 * 60 * 60, // 1 hour (stations rarely change)
    })

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
        mutationFn: ({ orderId, status, reason }: { orderId: string, status: Order['status'], reason?: string }) => {
            if (!isOnline) {
                throw new Error('Offline: Action enqueued for later sync.')
            }
            return OperationsService.updateStatus(orderId, status, reason)
        },
        onMutate: async ({ orderId, status, reason }) => {
            await queryClient.cancelQueries({ queryKey: ['orders'] })
            const previousOrders = queryClient.getQueryData<Order[]>(['orders'])

            queryClient.setQueryData<Order[]>(['orders'], (old) => {
                if (!old) return []
                return old.map(order =>
                    order.id === orderId
                        ? { ...order, status, reasonForStatus: reason || null }
                        : order
                )
            })

            return { previousOrders }
        },
        onSuccess: (updatedOrder) => {
            queryClient.invalidateQueries({ queryKey: ['orders-summary'] })
            addNotification({
                type: updatedOrder.status === 'red' ? 'CRITICAL' : 'SUCCESS',
                title: `${t('operations.batch')} ${updatedOrder.id}`,
                message: `${t('operations.statusUpdatedTo')} ${updatedOrder.status}`,
                actionUrl: `/dashboard/operaciones?order=${updatedOrder.id}`
            })
        },
        onError: (err, variables, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(['orders'], context.previousOrders)
            }
            enqueueAction({
                service: 'OperationsService',
                method: 'updateStatus',
                args: [variables.orderId, variables.status, variables.reason],
                label: `${t('operations.statusActionLabel')}: ${variables.status}`
            })
            addNotification({
                type: 'ERROR',
                title: t('common.error'),
                message: isOnline ? t('operations.errorUpdatingStatus') : t('operations.offlineQueued')
            })
        }
    })

    const createOrderMutation = useMutation({
        mutationFn: (order: Partial<Order>) => {
            if (!isOnline) {
                throw new Error('Offline: Action enqueued for later sync.')
            }
            return OperationsService.createOrder(order)
        },
        onMutate: async (newOrderPartial) => {
            await queryClient.cancelQueries({ queryKey: ['orders'] })
            const previousOrders = queryClient.getQueryData<Order[]>(['orders'])

            const tempId = `temp-${Date.now()}`
            const optimisticOrder: Order = {
                id: tempId,
                qrCode: '',
                status: newOrderPartial.status || 'amber',
                customer: newOrderPartial.customer || 'Offline Order',
                product: newOrderPartial.product || '',
                quantity: newOrderPartial.quantity || 0,
                unit: newOrderPartial.unit || 'Kg',
                dueDate: newOrderPartial.dueDate || new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                currentStationId: newOrderPartial.currentStationId || '',
                statusHistory: [],
                stationHistory: []
            }

            queryClient.setQueryData<Order[]>(['orders'], (old) => {
                if (!old) return [optimisticOrder]
                return [optimisticOrder, ...old]
            })

            return { previousOrders, tempId }
        },
        onSuccess: (newOrder, variables, context) => {
            queryClient.setQueryData(['orders'], (old: Order[] | undefined) => {
                if (!old) return [newOrder]
                return old.map(o => o.id === context?.tempId ? newOrder : o)
            })
            queryClient.invalidateQueries({ queryKey: ['orders-summary'] })
            addNotification({
                type: 'SUCCESS',
                title: t('operations.newBatchIdentified'),
                message: `${t('operations.batch')} ${newOrder.id} ${t('operations.sophiaRegistered')}`,
                actionUrl: `/dashboard/operaciones?order=${newOrder.id}`
            })
        },
        onError: (err, variables, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(['orders'], context.previousOrders)
            }
            enqueueAction({
                service: 'OperationsService',
                method: 'createOrder',
                args: [variables],
                label: `${t('operations.createActionLabel')}: ${variables.product}`
            })
            addNotification({
                type: 'ERROR',
                title: t('common.error'),
                message: isOnline ? t('operations.errorCreatingOrder') : t('operations.offlineQueued')
            })
        }
    })

    const moveStationMutation = useMutation({
        mutationFn: ({ orderId, stationId }: { orderId: string, stationId: string }) => {
            if (!isOnline) {
                throw new Error('Offline: Action enqueued for later sync.')
            }
            return OperationsService.moveToStation(orderId, stationId)
        },
        onMutate: async ({ orderId, stationId }) => {
            await queryClient.cancelQueries({ queryKey: ['orders'] })
            const previousOrders = queryClient.getQueryData<Order[]>(['orders'])

            queryClient.setQueryData<Order[]>(['orders'], (old) => {
                if (!old) return []
                return old.map(order =>
                    order.id === orderId
                        ? { ...order, currentStationId: stationId }
                        : order
                )
            })

            return { previousOrders }
        },
        onSuccess: (updatedOrder) => {
            queryClient.invalidateQueries({ queryKey: ['orders-summary'] })
            const stationName = stationsQuery.data?.find(s => s.id === updatedOrder.currentStationId)?.name || updatedOrder.currentStationId
            addNotification({
                type: 'INFO',
                title: t('operations.transitLabel'),
                message: `${updatedOrder.id} ${t('operations.movedTo')} ${stationName}`,
                actionUrl: `/dashboard/operaciones?order=${updatedOrder.id}`
            })
        },
        onError: (err, variables, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(['orders'], context.previousOrders)
            }
            enqueueAction({
                service: 'OperationsService',
                method: 'moveToStation',
                args: [variables.orderId, variables.stationId],
                label: t('operations.moveActionLabel')
            })
            addNotification({
                type: 'ERROR',
                title: t('common.error'),
                message: isOnline ? t('operations.errorMovingOrder') : t('operations.offlineQueued')
            })
        }
    })

    const getStationById = (id: string) => {
        return stationsQuery.data?.find(s => s.id === id)
    }

    return {
        stations: stationsQuery.data || [],
        isStationsLoading: stationsQuery.isLoading,
        getStationById,
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
