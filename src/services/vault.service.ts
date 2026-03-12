import { VaultDocument } from '@/types/sophia';

export class VaultService {
    static async getDocuments(): Promise<VaultDocument[]> {
        try {
            const res = await fetch('/api/vault');
            if (!res.ok) throw new Error('Failed to fetch documents');
            return await res.json();
        } catch (error) {
            console.error('Error fetching vault documents:', error);
            return [];
        }
    }

    static async uploadDocuments(files: File[]): Promise<any> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const res = await fetch('/api/vault/parse', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to parse documents');
        }

        return await res.json();
    }


    static async deleteDocument(id: string): Promise<void> {
        const res = await fetch(`/api/vault?id=${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to delete document');
        }
    }

    static async getVaultContext(): Promise<string> {
        // El RAG profundo (PgVector) se maneja ahora a nivel backend de manera nativa.
        return "";
    }
}
