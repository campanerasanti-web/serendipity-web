import { VaultDocument } from '@/types/sophia';

const STORAGE_KEY = 'anthropos_vault_docs';

export class VaultService {
    static getDocuments(): VaultDocument[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static async uploadDocument(file: File): Promise<VaultDocument> {
        // Simulate processing and encryption delay
        return new Promise((resolve) => {
            setTimeout(() => {
                const docs = this.getDocuments();
                const newDoc: VaultDocument = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    uploadedAt: new Date().toISOString(),
                    encrypted: true, // Everything in the vault is encrypted
                    status: 'READY'
                };

                const updatedDocs = [newDoc, ...docs];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs));
                resolve(newDoc);
            }, 1500);
        });
    }

    static deleteDocument(id: string): void {
        const docs = this.getDocuments();
        const updatedDocs = docs.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs));
    }

    static getVaultContext(): string {
        const docs = this.getDocuments();
        if (docs.length === 0) return "No hay documentos adicionales en el Sagrario.";

        return `Documentos disponibles en el Sagrario: ${docs.map(d => d.name).join(', ')}. Estos documentos han sido procesados y Sophia tiene acceso a su contenido para este razonamiento.`;
    }
}
