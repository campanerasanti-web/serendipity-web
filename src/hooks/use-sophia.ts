import { useFinance } from './use-finance';
import { useOperations } from './use-operations';
import { SophiaService, PRACTICAL_AGENTS, HERMETIC_PRINCIPLES } from '@/services/sophia.service';
import { AIService } from '@/services/ai.service';
import { VaultService } from '@/services/vault.service';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { ChatMessage, SophiaAlert, VaultDocument } from '@/types/sophia';
import { useTranslation } from '@/context/language-context';

export function useSophia() {
    const { data: finance } = useFinance();
    const { orders } = useOperations();
    const { t } = useTranslation();

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'sophia',
            content: '', // Will be set in useEffect
            timestamp: new Date().toISOString()
        }
    ]);

    // Set initial message once translation is available
    useEffect(() => {
        setMessages(prev => prev.map(m =>
            m.id === 'welcome' ? { ...m, content: t('sophia.welcomeMsg') } : m
        ));
    }, [t]);
    const [isTyping, setIsTyping] = useState(false);

    // Vault State
    const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setVaultDocs(VaultService.getDocuments());
    }, []);

    const alerts = useMemo(() => {
        return SophiaService.getGlobalAlerts(finance, orders);
    }, [finance, orders]);

    const sendMessage = async (content: string) => {
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const response = await AIService.generateResponse(content, finance, orders);
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const uploadToVault = async (file: File) => {
        setIsUploading(true);
        try {
            const newDoc = await VaultService.uploadDocument(file);
            setVaultDocs(prev => [newDoc, ...prev]);
            return newDoc;
        } finally {
            setIsUploading(false);
        }
    };

    const deleteFromVault = (id: string) => {
        VaultService.deleteDocument(id);
        setVaultDocs(prev => prev.filter(d => d.id !== id));
    };

    const generateDailyReport = () => {
        setIsTyping(true);
        setTimeout(() => {
            const reportContent = SophiaService.generateProactiveAnalysis(finance, orders);
            const reportMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'sophia',
                content: reportContent,
                timestamp: new Date().toISOString(),
                agentSource: 'PROCESS'
            };
            setMessages(prev => [...prev, reportMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const criticalAlerts = alerts.filter(a => a.type === 'CRITICAL');
    const warningAlerts = alerts.filter(a => a.type === 'WARNING');

    return {
        alerts,
        criticalAlerts,
        warningAlerts,
        hasAlerts: alerts.length > 0,
        sophiaStatus: criticalAlerts.length > 0 ? 'ALERTA' : alerts.length > 0 ? 'VIGILANTE' : 'BALANCE',
        practicalAgents: PRACTICAL_AGENTS,
        hermeticPrinciples: HERMETIC_PRINCIPLES,
        agents: PRACTICAL_AGENTS,
        messages,
        sendMessage,
        generateDailyReport,
        isTyping,
        // Vault Exports
        vaultDocs,
        isUploading,
        uploadToVault,
        deleteFromVault
    };
}
