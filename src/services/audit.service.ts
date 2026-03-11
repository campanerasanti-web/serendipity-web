import { createClient } from '@/lib/supabase/client'

export interface AuditLog {
    id: string
    type: 'SCAN' | 'ARRIVAL' | 'EXPENSE' | 'SYSTEM'
    title: string
    user: string
    time: string
    detail: string
    status: 'COMPLETED' | 'PENDING' | 'CRITICAL'
}

export const AuditService = {
    async getLogs(): Promise<AuditLog[]> {
        const supabase = createClient();
        if (!supabase) return [];

        // Fetch movements for the audit
        const { data: movements } = await supabase
            .from('order_station_movements')
            .select(`
                id,
                entered_at,
                order:order_id(customer, product),
                station:station_id(name),
                user:handled_by(name)
            `)
            .order('entered_at', { ascending: false })
            .limit(10);

        // Fetch recent transactions as audit items
        const { data: txs } = await supabase
            .from('transactions')
            .select(`
                id,
                date,
                amount,
                category,
                type,
                user:user_id(name)
            `)
            .order('date', { ascending: false })
            .limit(10);

        const logs: AuditLog[] = [];

        // Process movements as SCAN/ARRIVAL logs
        (movements || []).forEach((m: any) => {
            logs.push({
                id: `mov-${m.id}`,
                type: 'SCAN',
                title: `Escaneo: ${m.order?.product || 'Lote'}`,
                user: m.user?.name || 'Operativo',
                time: this.formatTime(m.entered_at),
                detail: `Estación: ${m.station?.name || 'Mesa 1'} - ${m.order?.customer || 'S/N'}`,
                status: 'COMPLETED'
            });
        });

        // Process transactions as EXPENSE logs
        (txs || []).forEach((t: any) => {
            logs.push({
                id: `tx-${t.id}`,
                type: 'EXPENSE',
                title: `Transacción: ${t.category || 'General'}`,
                user: t.user?.name || 'Administrador',
                time: this.formatTime(t.date),
                detail: `${t.type === 'INCOME' ? 'Ingreso' : 'Egreso'}: $${Number(t.amount).toLocaleString()}`,
                status: 'COMPLETED'
            });
        });

        // Sort all by time (we'll just use the IDs for simplicity in mock if we can't parse all perfectly)
        return logs.slice(0, 15);
    },

    formatTime(dateStr: string): string {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffInMs = now.getTime() - date.getTime();
            const diffInMins = Math.floor(diffInMs / (1000 * 60));
            
            if (diffInMins < 60) return `${diffInMins}m atrás`;
            const diffInHours = Math.floor(diffInMins / 60);
            if (diffInHours < 24) return `${diffInHours}h atrás`;
            return date.toLocaleDateString();
        } catch (e) {
            return 'Reciente';
        }
    }
}
