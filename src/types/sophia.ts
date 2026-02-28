/**
 * TIPOS SOPHIA - SISTEMA INTEGRADO
 * Combina la brújula moral (Pilares) con la interfaz de micro-agentes.
 */

// ============================================================
// PILARES FUNDAMENTALES (Core Wisdom)
// ============================================================

export type PillarName =
    | 'presencia'        // Chakra Sacro - 417 Hz
    | 'resiliencia'      // Chakra Raíz - 396 Hz
    | 'claridad'         // Chakra Plexo - 528 Hz
    | 'compasión'        // Chakra Corazón - 639 Hz
    | 'discernimiento'   // Chakra Garganta - 741 Hz
    | 'paciencia'        // Chakra Sacro - 417 Hz
    | 'integridad'       // Chakra Tercer Ojo - 852 Hz
    | 'humildad'         // Chakra Raíz - 396 Hz
    | 'coherencia'       // Chakra Corona - 963 Hz
    | 'servicio';        // Chakra Garganta - 741 Hz

export interface PillarMetadata {
    name: PillarName;
    chakra: 'raíz' | 'sacro' | 'plexo' | 'corazón' | 'garganta' | 'tercer-ojo' | 'corona';
    frequency: number;      // Hertz para sonido
    color: string;          // Hex color
    emoji: string;
    description: string;
    qualities: string[];
}

export const PILLARS: Record<PillarName, PillarMetadata> = {
    presencia: {
        name: 'presencia',
        chakra: 'sacro',
        frequency: 417,
        color: '#FF9500',
        emoji: '🎯',
        description: 'Vivir el ahora con atención plena',
        qualities: ['atención', 'consciencia', 'enfoque', 'presencia-mental']
    },
    resiliencia: {
        name: 'resiliencia',
        chakra: 'raíz',
        frequency: 396,
        color: '#DC2626',
        emoji: '💪',
        description: 'Capacidad de recuperación ante adversidad',
        qualities: ['fortaleza', 'adaptación', 'superación', 'persistencia']
    },
    claridad: {
        name: 'claridad',
        chakra: 'plexo',
        frequency: 528,
        color: '#F59E0B',
        emoji: '🔆',
        description: 'Visión clara de lo esencial',
        qualities: ['lucidez', 'enfoque', 'verdad', 'percepción']
    },
    compasión: {
        name: 'compasión',
        chakra: 'corazón',
        frequency: 639,
        color: '#EC4899',
        emoji: '❤️',
        description: 'Conexión empática con todo lo viviente',
        qualities: ['empatía', 'amor', 'amabilidad', 'conexión']
    },
    discernimiento: {
        name: 'discernimiento',
        chakra: 'garganta',
        frequency: 741,
        color: '#06B6D4',
        emoji: '🗣️',
        description: 'Capacidad de distinguir lo verdadero de lo falso',
        qualities: ['sabiduría', 'juicio', 'discreción', 'verdad']
    },
    paciencia: {
        name: 'paciencia',
        chakra: 'sacro',
        frequency: 417,
        color: '#14B8A6',
        emoji: '⏱️',
        description: 'Capacidad de esperar y fluir con el tiempo',
        qualities: ['calma', 'aceptación', 'equilibrio', 'tiempo']
    },
    integridad: {
        name: 'integridad',
        chakra: 'tercer-ojo',
        frequency: 852,
        color: '#8B5CF6',
        emoji: '🛡️',
        description: 'Alineación entre pensamiento, palabra y acción',
        qualities: ['honestidad', 'consistencia', 'seguridad', 'autenticidad']
    },
    humildad: {
        name: 'humildad',
        chakra: 'raíz',
        frequency: 396,
        color: '#64748B',
        emoji: '🌱',
        description: 'Reconocer la vastedad del aprendizaje y el desconocimiento',
        qualities: ['apertura', 'aprendizaje', 'modestia', 'crecimiento']
    },
    coherencia: {
        name: 'coherencia',
        chakra: 'corona',
        frequency: 963,
        color: '#FBBF24',
        emoji: '✨',
        description: 'Armonía entre todos los sistemas del ser',
        qualities: ['armonía', 'unidad', 'sincronía', 'integridad-holística']
    },
    servicio: {
        name: 'servicio',
        chakra: 'garganta',
        frequency: 741,
        color: '#10B981',
        emoji: '🤝',
        description: 'Acción orientada al bien mayor',
        qualities: ['generosidad', 'propósito', 'provisión', 'contribución']
    }
};

// ============================================================
// WEB CLIENT TYPES (Frontend Agents)
// ============================================================

export type AgentType = 'FINANCE' | 'OPERATIONS' | 'HUMAN_CAPITAL' | 'PROCESS';

export interface MicroAgent {
    id: string;
    name: string;
    type: AgentType;
    status: 'ACTIVE' | 'IDLE' | 'ERROR';
    lastReport: string;
    description: string;
}

export interface SophiaAlert {
    id: string;
    agentId: string;
    type: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    category: AgentType;
    timestamp: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'sophia';
    content: string;
    timestamp: string;
    agentSource?: AgentType;
}

export interface VaultDocument {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    encrypted: boolean;
    status: 'READY' | 'PROCESSING' | 'ERROR';
}

export interface SophiaState {
    status: 'BALANCE' | 'VIGILANTE' | 'ALERTA';
    agents: MicroAgent[];
    alerts: SophiaAlert[];
}

// ============================================================
// CORE WISDOM TYPES (RAG & Engine)
// ============================================================

export interface WisdomChunk {
    source: string;
    content: string;
    pillar: PillarName;
    keywords: string[];
    excerpt?: string;
}

export interface SophiaInsight {
    id: string;
    category: PillarName;
    message: string;
    pillar_metadata: PillarMetadata;
    sources: string[];
    confidence: number;
    chakra_frequency: number;
    timestamp: string;
}

export interface PillarBrilliance {
    pillar: PillarName;
    brightness: number;
    activity_count: number;
    last_activated: string;
    insight: SophiaInsight | null;
}

export interface PillarConstellation {
    timestamp: string;
    pillars: Record<PillarName, PillarBrilliance>;
    dominant_pillar: PillarName;
    system_resonance: number;
}

export interface DailyLearning {
    date: string;
    reflection: string;
    primary_pillar: PillarName;
    secondary_pillars: PillarName[];
    agent_source?: string;
}

export interface IntentionVector {
    query: string;
    detected_pillar: PillarName;
    matched_wisdom: WisdomChunk[];
    recommended_frequency: number;
    aligned_message: string;
    action_guidance?: string;
}
