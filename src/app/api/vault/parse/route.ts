import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
const pdfParse = require('pdf-parse');

// Initialize Gemini and Supabase server components
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_AI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseServiceKey) 
    ? createClient(supabaseUrl, supabaseServiceKey) 
    : null;

function chunkText(text: string, maxChunkSize = 1000, overlap = 200): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + maxChunkSize));
        i += maxChunkSize - overlap;
    }
    return chunks;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        if (!supabase || !genAI) {
            return NextResponse.json({ error: 'System AI configuration or Database missing' }, { status: 500 });
        }

        const results = [];

        for (const file of files) {
            try {
                let extractedText = '';

                if (file.type === 'application/pdf') {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const data = await pdfParse(buffer);
                    extractedText = data.text;
                } else if (file.type === 'text/plain' || file.type === 'application/json' || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
                    extractedText = await file.text();
                } else {
                    results.push({ name: file.name, error: 'Unsupported file type' });
                    continue;
                }

                // 1. Insert Document Record
                const { data: documentRecord, error: docError } = await supabase
                    .from('vault_documents')
                    .insert({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        status: 'READY'
                    })
                    .select()
                    .single();

                if (docError) {
                    results.push({ name: file.name, error: `Database error: ${docError.message}` });
                    continue;
                }

                const documentId = documentRecord.id;

                // 2. Chunk Text
                const chunks = chunkText(extractedText);
                const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

                // 3. Generate Embeddings & Save
                let chunkCount = 0;
                for (const chunk of chunks) {
                    if (!chunk.trim()) continue;
                    
                    try {
                        const result = await embeddingModel.embedContent(chunk);
                        const embedding = result.embedding.values;
                        
                        await supabase.from('vault_embeddings').insert({
                            document_id: documentId,
                            content: chunk,
                            embedding: embedding
                        });
                        chunkCount++;
                    } catch (embedError) {
                        console.warn(`Could not embed chunk for ${file.name}`, embedError);
                    }
                }

                results.push({ 
                    name: file.name, 
                    documentId: documentId, 
                    status: 'success',
                    chunks: chunkCount
                });
            } catch (fileError: any) {
                console.error(`Error processing file ${file.name}:`, fileError);
                results.push({ name: file.name, error: fileError.message });
            }
        }

        return NextResponse.json({ 
            processed: results,
            summary: `${results.filter(r => r.status === 'success').length} de ${files.length} archivos procesados.`
        });
    } catch (error: any) {
        console.error('Critical Error in parsing batch:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

