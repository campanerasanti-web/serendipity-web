import { Order, OperationSummary } from '@/types/operations'

// MOCK DATA for Phase 2 implementation
// Initial data for the system
const DEFAULT_ORDERS: Order[] = [
    {
        id: 'LOTE-2024-001',
        qrCode: 'https://anthropos.io/qr/LOTE-2024-001',
        status: 'amber',
        customer: 'Prará Asia',
        product: 'Vacuno Prime',
        quantity: 450,
        unit: 'SF',
        dueDate: '2024-03-15T00:00:00Z',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-24T14:00:00Z',
        currentStationId: 'est-2',
        stationHistory: [
            { stationId: 'est-1', enteredAt: '2024-02-01T10:00:00Z', exitedAt: '2024-02-15T09:00:00Z' },
            { stationId: 'est-2', enteredAt: '2024-02-15T09:00:00Z' }
        ],
        statusHistory: [
            { status: 'red', timestamp: '2024-02-01T10:00:00Z', reason: 'Orden creada' },
            { status: 'amber', timestamp: '2024-02-15T09:00:00Z', reason: 'Iniciado en Estación 2' }
        ]
    }
];

let MOCK_ORDERS: Order[] = [];

// Helper to handle persistence
const persist = (orders: Order[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('serendipity_orders', JSON.stringify(orders));
    }
};

const load = (): Order[] => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('serendipity_orders');
        if (saved) return JSON.parse(saved);
    }
    return DEFAULT_ORDERS;
};

// Initialize
if (MOCK_ORDERS.length === 0) {
    MOCK_ORDERS = load();
}

export const OperationsService = {
    // ... items stay same
    async getOrders(): Promise<Order[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...MOCK_ORDERS]), 150)
        })
    },

    async getSummary(): Promise<OperationSummary> {
        return {
            totalOrders: MOCK_ORDERS.length + 6,
            activeOrders: MOCK_ORDERS.length,
            completedToday: 3,
            averageCycleTime: '4.2 días'
        }
    },

    async updateStatus(orderId: string, status: Order['status'], reason?: string): Promise<Order> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const order = MOCK_ORDERS.find(o => o.id === orderId)
                if (order) {
                    order.status = status
                    order.updatedAt = new Date().toISOString()
                    order.statusHistory.push({
                        status,
                        timestamp: order.updatedAt,
                        reason: reason || 'Actualización de flujo'
                    })
                    persist(MOCK_ORDERS)
                    resolve({ ...order })
                }
            }, 150)
        })
    },

    async moveToStation(orderId: string, stationId: string): Promise<Order> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const order = MOCK_ORDERS.find(o => o.id === orderId)
                if (order) {
                    const now = new Date().toISOString()
                    // Close current station
                    const currentMove = order.stationHistory.find(h => h.stationId === order.currentStationId && !h.exitedAt)
                    if (currentMove) {
                        currentMove.exitedAt = now
                    }
                    // Open new station
                    order.currentStationId = stationId
                    order.stationHistory.push({
                        stationId,
                        enteredAt: now
                    })
                    order.updatedAt = now
                    persist(MOCK_ORDERS)
                    resolve({ ...order })
                }
            }, 150)
        })
    },

    async createOrder(order: Partial<Order>): Promise<Order> {
        return new Promise((resolve) => {
            const now = new Date().toISOString()
            const newOrder: Order = {
                id: `LOTE-2024-${String(MOCK_ORDERS.length + 1).padStart(3, '0')}`,
                qrCode: `https://anthropos.io/qr/LOTE-2024-${String(MOCK_ORDERS.length + 1).padStart(3, '0')}`,
                status: 'red',
                customer: order.customer || 'Cliente Prototipo',
                product: order.product || 'Artículo de Prueba',
                quantity: order.quantity || 100,
                unit: order.unit || 'SF',
                dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
                createdAt: now,
                updatedAt: now,
                currentStationId: order.currentStationId || 'est-1',
                stationHistory: [{ stationId: order.currentStationId || 'est-1', enteredAt: now }],
                statusHistory: [{ status: 'red', timestamp: now, reason: 'Escaneo inicial' }],
                ...order
            } as Order
            MOCK_ORDERS.unshift(newOrder)
            persist(MOCK_ORDERS)
            setTimeout(() => resolve({ ...newOrder }), 150)
        })
    }
}
