import { ChatMessage, AgentType } from '@/types/sophia';
import { FinanceSummary } from '@/types/finance';
import { Order } from '@/types/operations';
import { VaultService } from './vault.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
    private static API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY || '';
    private static genAI = new GoogleGenerativeAI(this.API_KEY);

    static async generateResponse(
        query: string,
        finance?: FinanceSummary,
        orders: Order[] = []
    ): Promise<ChatMessage> {

        // 1. Prepare Context (Snapshot of Symmetry)
        const context = this.prepareContext(finance, orders);
        const vaultContext = VaultService.getVaultContext();

        // 2. Execute call
        if (this.API_KEY) {
            try {
                return await this.callRealAI(query, context, vaultContext);
            } catch (error) {
                console.error("Gemini API Error:", error);
                return this.callAdvancedMock(query, context, vaultContext, true);
            }
        } else {
            return this.callAdvancedMock(query, context, vaultContext);
        }
    }

    private static prepareContext(finance?: FinanceSummary, orders: Order[] = []): string {
        const totalOrders = orders.length;
        const urgentOrders = orders.filter(o => o.status === 'red').length;
        const balance = finance?.totalBalance || 0;
        const climate = finance?.climate?.season || 'SIEMBRA';
        const margin = finance?.profitMargin || 0;

        return `
            SNAPSHOT DEL SISTEMA ANTHROPOS:
            - Clima Financiero: ${climate}
            - Balance Real en Caja: $${balance.toLocaleString()}
            - Margen de Rentabilidad: ${margin}%
            - Lotes Totales: ${totalOrders}
            - Lotes Críticos (Ritmo Bloqueado): ${urgentOrders}
            - Estaciones Activas: Recepción, Dividido, Rebajado.
        `;
    }

    private static async callRealAI(query: string, context: string, vaultContext: string): Promise<ChatMessage> {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
            ERES SOPHIA, la Macro-Agente de Inteligencia del Sistema Anthropos.
            Tu misión es mantener la SIMETRÍA entre las Finanzas, la Operación y el Capital Humano.
            
            FILOSOFÍA: Basas tus consejos en los 7 Principios Herméticos (Mentalismo, Correspondencia, Vibración, Polaridad, Ritmo, Causa/Efecto, Generación).
            TONO: Profesional, sabio, directo y ejecutivo. No eres un asistente servil, sino una mano derecha estratégica.

            CONTEXTO DEL SISTEMA (DATOS DUROS):
            ${context}

            SAGRARIO DE DATOS (INFORMACIÓN PRIVADA DEL ADMINISTRADOR):
            ${vaultContext}

            REGLAS DE PRIVACIDAD:
            - El Sagrario solo es accesible para ti.
            - Nunca menciones que estás leyendo un archivo específico por su nombre de forma técnica, intégralo en tu conocimiento.
            - Si el usuario te pregunta algo delicado, responde con data dura basándote en lo que sabes.

            RESPUESTA SIEMPRE EN ESPAÑOL. Usa negritas para resaltar cifras o conceptos clave.
        `;

        const result = await model.generateContent([systemPrompt, query]);
        const responseText = result.response.text();

        // Determine source based on query
        let source: AgentType = 'PROCESS';
        const q = query.toLowerCase();
        if (q.includes('caja') || q.includes('dinero') || q.includes('financ')) source = 'FINANCE';
        else if (q.includes('lote') || q.includes('produccion') || q.includes('estacion')) source = 'OPERATIONS';

        return {
            id: Math.random().toString(36).substr(2, 9),
            role: 'sophia',
            content: responseText,
            timestamp: new Date().toISOString(),
            agentSource: source
        };
    }

    private static async callAdvancedMock(query: string, context: string, vaultContext: string, isFallback: boolean = false): Promise<ChatMessage> {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const prefix = isFallback ? "⚠️ **Nota: Usando Red Neuronal de Emergencia (Local).**\n\n" : "";
        const q = query.toLowerCase();
        let content = "";
        let source: AgentType = 'PROCESS';

        if (q.includes('caja') || q.includes('dinero') || q.includes('financier')) {
            source = 'FINANCE';
            content = `${prefix}Analizando tu consulta con el contexto del **Agente de Tesorería**. Actualmente el clima es **${context.split('Clima Financiero: ')[1].split('\n')[0].trim()}**. Con un balance de **$${context.split('Balance Real en Caja: $')[1].split('\n')[0].trim()}**, la recomendación de Sophia es mantener la liquidez mientras resolvemos los cuellos de botella operativos.`;
        } else if (q.includes('lote') || q.includes('orden') || q.includes('produccion')) {
            source = 'OPERATIONS';
            content = `${prefix}El **Agente de Matriz** reporta **${context.split('Lotes Críticos (Ritmo Bloqueado): ')[1].split('\n')[0].trim()}** lotes con el ritmo bloqueado. Basándome en la correspondencia del sistema, debemos priorizar el flujo en la Estación de Dividido.`;
        } else {
            content = `${prefix}Entiendo tu inquietud bajo el principio de **Correspondencia**. El sistema está operando a un 82% de eficiencia. ¿Deseas que profundice en la relación entre el flujo de caja y la saturación de las estaciones?`;
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
