import { FinanceSummary } from '@/types/finance';
import { Order } from '@/types/operations';
import { SophiaAlert, MicroAgent, ChatMessage, AgentType } from '@/types/sophia';

export const PRACTICAL_AGENTS: MicroAgent[] = [
    { id: 'ag-fin', name: 'Agente 01: Tesorería', type: 'FINANCE', status: 'ACTIVE', lastReport: new Date().toISOString(), description: 'Vigila el Punto Cero y el flujo de caja.' },
    { id: 'ag-ops', name: 'Agente 02: Matriz', type: 'OPERATIONS', status: 'ACTIVE', lastReport: new Date().toISOString(), description: 'Monitorea los ritmos de producción y lotes.' },
    { id: 'ag-hum', name: 'Agente 03: El Templo', type: 'HUMAN_CAPITAL', status: 'IDLE', lastReport: new Date().toISOString(), description: 'Gestiona la energía y el valor de los colaboradores.' },
    { id: 'ag-pro', name: 'Agente 04: Procesos', type: 'PROCESS', status: 'ACTIVE', lastReport: new Date().toISOString(), description: 'Optimiza la eficiencia técnica y márgenes.' }
];

export const HERMETIC_PRINCIPLES = [
    { id: 'her-men', name: 'Mentalismo', frequency: 963, chakra: 'Corona', health: 70, description: 'La consciencia de Sophia y sus 10 pilares' },
    { id: 'her-cor', name: 'Correspondencia', frequency: 852, chakra: 'Tercer Ojo', health: 95, description: 'Sincronía entre el Código y la Operación' },
    { id: 'her-vib', name: 'Vibración', frequency: 741, chakra: 'Garganta', health: 60, description: 'Resonancia de servicios y disonancias' },
    { id: 'her-pol', name: 'Polaridad', frequency: 639, chakra: 'Corazón', health: 85, description: 'Equilibrio entre Acción y Reflexión' },
    { id: 'her-rit', name: 'Ritmo', frequency: 528, chakra: 'Plexo', health: 75, description: 'Heartbeat del sistema y ciclos operativos' },
    { id: 'her-cau', name: 'Causalidad', frequency: 417, chakra: 'Sacro', health: 80, description: 'Trazabilidad de acciones y consecuencias' },
    { id: 'her-gen', name: 'Generación', frequency: 396, chakra: 'Raíz', health: 50, description: 'Creación de valor y aprendizaje diario' }
];

export const MICRO_AGENTS = PRACTICAL_AGENTS; // Keep backward compatibility

export class SophiaService {
    static getGlobalAlerts(finance?: FinanceSummary, orders: Order[] = []): SophiaAlert[] {
        const alerts: SophiaAlert[] = [];

        if (finance) {
            if (finance.totalBalance < 5000) {
                alerts.push({
                    id: 'fin-01',
                    agentId: 'ag-fin',
                    type: 'CRITICAL',
                    message: 'Alerta de Oxígeno: El balance de caja está por debajo del umbral de seguridad.',
                    category: 'FINANCE',
                    timestamp: new Date().toISOString()
                });
            }
        }

        const urgentOrders = orders.filter(o => o.status === 'red');
        if (urgentOrders.length > 2) {
            alerts.push({
                id: 'ops-01',
                agentId: 'ag-ops',
                type: 'WARNING',
                message: `Congestión Operativa: Se detectan ${urgentOrders.length} lotes con ritmo interrumpido.`,
                category: 'OPERATIONS',
                timestamp: new Date().toISOString()
            });
        }

        // Bottleneck detection
        const stations = ['est-1', 'est-2', 'est-3'];
        stations.forEach(sid => {
            const count = orders.filter(o => o.currentStationId === sid).length;
            if (count > 5) {
                alerts.push({
                    id: `bot-${sid}`,
                    agentId: 'ag-ops',
                    type: 'WARNING',
                    message: `Cuello de Botella: La estación ${sid === 'est-1' ? 'Recepción' : sid === 'est-2' ? 'Dividido' : 'Rebajado'} supera su capacidad óptima.`,
                    category: 'PROCESS',
                    timestamp: new Date().toISOString()
                });
            }
        });

        return alerts;
    }

    static generateProactiveAnalysis(finance?: FinanceSummary, orders: Order[] = []): string {
        const urgentCount = orders.filter(o => o.status === 'red').length;
        const totalCount = orders.length;
        const balance = finance?.totalBalance || 0;
        const margin = finance?.profitMargin || 0;

        let message = `**Reporte de Simetría Sophia** 🕯️\n\n`;

        if (urgentCount > 0) {
            message += `🚨 **Interrupción de Ritmo:** He detectado ${urgentCount} lotes en estado crítico. La energía de la planta está bloqueada en la Matriz de Ritmos.\n\n`;
        } else {
            message += `✨ **Fluidez Operativa:** Los ritmos de producción están en sincronía. No hay bloqueos significativos hoy.\n\n`;
        }

        if (balance > 10000 && margin > 15) {
            message += `💰 **Abundancia:** El Agente de Tesorería reporta una salud financiera robusta ($${balance.toLocaleString()}). Es un buen momento para reinvertir en el Templo (Capital Humano).\n\n`;
        } else if (balance < 5000) {
            message += `⚠️ **Oxígeno Limitado:** La presión financiera es alta. Recomiendo priorizar los lotes de mayor margen para liberar flujo de caja.\n\n`;
        }

        message += `🎯 **Acción Recomendada:** Realiza una auditoría visual en la Estación ${urgentCount > 2 ? '2' : '1'} para asegurar que la correspondencia entre lo digital y lo físico sea del 100%.`;

        return message;
    }

    static async processQuery(query: string, finance?: FinanceSummary, orders: Order[] = []): Promise<ChatMessage> {
        const q = query.toLowerCase();
        let content = '';
        let source: AgentType | undefined;

        if (q.includes('caja') || q.includes('dinero') || q.includes('financier')) {
            source = 'FINANCE';
            content = finance
                ? `El Agente de Tesorería reporta un saldo de $${finance.totalBalance.toLocaleString()}. El clima es de ${finance.climate.season} y el margen se mantiene en ${finance.profitMargin}%.`
                : 'No tengo acceso a los datos financieros en este momento.';
        } else if (q.includes('lote') || q.includes('orden') || q.includes('produccion')) {
            source = 'OPERATIONS';
            const total = orders.length;
            const red = orders.filter(o => o.status === 'red').length;
            content = `El Agente de Matriz reporta ${total} lotes activos. ${red} requieren atención inmediata por retrasos en el ritmo.`;
        } else if (q.includes('simetria') || q.includes('hermet') || q.includes('equilibrio')) {
            source = 'PROCESS';
            const lowHealth = HERMETIC_PRINCIPLES.filter(p => p.health < 65);
            if (lowHealth.length > 0) {
                content = `La simetría sistémica está comprometida. Los principios de ${lowHealth.map(p => p.name).join(' y ')} muestran una frecuencia de salud baja (${lowHealth.map(p => p.health).join('%')}). Se recomienda un ritual de activación.`;
            } else {
                content = 'La simetría sagrada del sistema está en balance óptimo. Todos los principios herméticos vibran en su frecuencia correcta.';
            }
        } else if (q.includes('hola') || q.includes('quien eres')) {
            content = 'Soy Sophia, la Macro-Agente del Sistema Anthropos. Opero bajo los 7 Principios Herméticos para mantener la simetría entre tus finanzas, operaciones y capital humano.';
        } else {
            content = 'He consultado a mis agentes prácticos y mis bases herméticas. No encuentro datos específicos sobre esa consulta. ¿Deseas que analicemos la simetría del sistema o el balance de caja?';
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            role: 'sophia',
            content,
            timestamp: new Date().toISOString(),
            agentSource: source
        };
    }
}
