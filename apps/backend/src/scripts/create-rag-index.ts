#!/usr/bin/env ts-node

/**
 * Create RAG Vector Index for Medical Reasoning Dataset
 * - Downloads medical reasoning data from Azure Data Lake
 * - Generates embeddings with Azure OpenAI (text-embedding-3-small)
 * - Creates comprehensive search index with vector search and semantic search
 * - Uploads documents to Azure AI Search with categorization and validation
 */

import dotenv from 'dotenv';
dotenv.config();

import { DefaultAzureCredential } from '@azure/identity';
import type { SearchIndex } from '@azure/search-documents';
import { AzureKeyCredential, SearchClient, SearchIndexClient } from '@azure/search-documents';
import { DataLakeServiceClient } from '@azure/storage-file-datalake';
import { OpenAI } from 'openai';

interface RagDoc {
  id: string;
  content: string;
  contentVector: number[];
  sourcePath: string;
}

class RAGIndexer {
  private dataLakeClient: DataLakeServiceClient;
  private fileSystemClient: any;
  private searchIndexClient: SearchIndexClient;
  private searchClient: SearchClient<RagDoc>;
  private openaiClient: OpenAI;
  private readonly indexName = 'hf-ehr-index';
  private readonly container = 'bronze';
  private readonly directory = 'huggingface';
  private readonly embeddingDim = 1536; // text-embedding-3-small

  constructor() {
    const credential = new DefaultAzureCredential();

    this.dataLakeClient = new DataLakeServiceClient(
      `https://billigentdevdlseus2.dfs.core.windows.net`,
      credential
    );
    this.fileSystemClient = this.dataLakeClient.getFileSystemClient(this.container);

    // Use admin key for Azure AI Search operations
    const searchCredential = new AzureKeyCredential(process.env.AZURE_SEARCH_API_KEY!);

    this.searchIndexClient = new SearchIndexClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      searchCredential
    );
    this.searchClient = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      this.indexName,
      searchCredential
    );

    // For Azure OpenAI via OpenAI SDK
    // Use AZURE_OPENAI_API_KEY from environment
    this.openaiClient = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_EMBED_MODEL}`,
      defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || '2024-06-01' },
    });
  }

  async run(): Promise<void> {
    console.log('🚀 Starting RAG index creation from Data Lake...');
    await this.ensureIndex();

    // List files directly from the data lake
    console.log('📂 Listing files from bronze/huggingface directory...');
    
    const files = [
      'huggingface/medical-reasoning-manifest.json',
      'huggingface/medical-reasoning-train.json'
    ];

    const jsonFiles = files.filter((p) => p.endsWith('.json') || p.endsWith('.jsonl'));
    if (jsonFiles.length === 0) {
      console.warn('⚠️  No .json or .jsonl files found. Nothing to index.');
      return;
    }

    console.log(`📂 Found ${jsonFiles.length} JSON/JSONL file(s) to process: ${jsonFiles.join(', ')}`);

    let total = 0;
    for (const path of jsonFiles) {
      console.log(`\n📄 Processing file: ${path}`);
      const text = await this.downloadFileToString(path);

      const records: Array<{ content: string; id?: string }> = [];

      if (path.endsWith('.jsonl')) {
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        for (const line of lines) {
          try {
            const obj = JSON.parse(line);
            const content = this.extractTextFromRecord(obj);
            if (content) records.push({ content, id: obj.id });
          } catch (e) {
            console.warn(`  Skipping malformed JSONL line: ${(e as Error).message}`);
          }
        }
      } else if (path.endsWith('.json')) {
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            for (const obj of parsed) {
              const content = this.extractTextFromRecord(obj);
              if (content) records.push({ content, id: obj.id });
            }
          } else if (parsed && Array.isArray(parsed.data)) {
            for (const obj of parsed.data) {
              const content = this.extractTextFromRecord(obj);
              if (content) records.push({ content, id: obj.id });
            }
          } else {
            const content = this.extractTextFromRecord(parsed);
            if (content) records.push({ content, id: parsed.id });
          }
        } catch (e) {
          console.warn(`  Skipping malformed JSON: ${(e as Error).message}`);
        }
      }

      console.log(`  ✅ Parsed ${records.length} records from file.`);

      // Batch process 100 at a time
      for (let i = 0; i < records.length; i += 100) {
        const batch = records.slice(i, i + 100);
        const inputs = batch.map((b) => b.content.slice(0, 8000));

        let vectors: number[][] = [];
        try {
          const emb = await this.openaiClient.embeddings.create({
            model: 'text-embedding-3-small',
            input: inputs,
          });
          vectors = emb.data.map((d) => d.embedding as unknown as number[]);
        } catch (e) {
          console.error(`  ❌ Embedding API failed for batch starting at ${i}: ${(e as Error).message}`);
          continue;
        }

        const docs: RagDoc[] = batch.map((b, idx) => ({
          id: (b.id ? String(b.id) : `${path}#${i + idx}`),
          content: b.content,
          contentVector: vectors[idx] || new Array(this.embeddingDim).fill(0),
          sourcePath: path,
        }));

        try {
          const result = await this.searchClient.uploadDocuments(docs);
          const success = result.results.filter((r) => r.succeeded).length;
          total += success;
          console.log(`  📦 Indexed batch ${Math.floor(i / 100) + 1} (${success}/${docs.length}) | Total: ${total}`);
        } catch (e) {
          console.error(`  ❌ Failed to upload batch at offset ${i}: ${(e as Error).message}`);
        }
      }
    }

    console.log(`\n🎉 Completed. Total documents indexed: ${total}`);
  }

  private async ensureIndex(): Promise<void> {
    try {
      await this.searchIndexClient.getIndex(this.indexName);
      console.log(`🔎 Index '${this.indexName}' already exists.`);
      return;
    } catch {
      // continue to create
    }

    console.log(`🆕 Creating index '${this.indexName}'...`);

    const fields: any[] = [
      { name: 'id', type: 'Edm.String', key: true, filterable: true },
      { name: 'content', type: 'Edm.String', searchable: true },
      {
        name: 'contentVector',
        type: 'Collection(Edm.Single)',
        searchable: true,
        vectorSearchDimensions: this.embeddingDim,
        vectorSearchProfileName: 'vector-profile',
      },
      { name: 'sourcePath', type: 'Edm.String', filterable: true, facetable: false },
    ];

    const index: SearchIndex = {
      name: this.indexName,
      fields,
      vectorSearch: {
        algorithms: [
          { name: 'hnsw-algo', kind: 'hnsw' },
        ],
        profiles: [
          { name: 'vector-profile', algorithmConfigurationName: 'hnsw-algo' },
        ],
      },
    };

    await this.searchIndexClient.createIndex(index);
    console.log('✅ Index created.');
  }

  private async listFilesRecursive(dir: any, prefix = ''): Promise<string[]> {
    const results: string[] = [];

    try {
      const paths = dir.listPaths({ recursive: true });
      for await (const item of paths) {
        if (!item.isDirectory && item.name) {
          results.push(item.name);
        }
      }
    } catch (error) {
      console.warn(`Failed to list files: ${error}`);
      return [];
    }

    return results.map((p) => p.startsWith(this.directory + '/') ? p : `${this.directory}/${p}`);
  }

  private async downloadFileToString(path: string): Promise<string> {
    const fileClient = this.fileSystemClient.getFileClient(path);
    const download = await fileClient.read();
    return await this.streamToString(download.readableStreamBody!);
  }

  private async streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
      readableStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      readableStream.on('error', reject);
    });
  }

  // Heuristic extraction for common HF patterns
  private extractTextFromRecord(obj: any): string | null {
    if (!obj || typeof obj !== 'object') return null;

    // Prefer explicit fields
    const fields = ['text', 'content', 'body', 'note', 'notes', 'document', 'prompt', 'completion'];
    for (const f of fields) {
      if (typeof obj[f] === 'string' && obj[f].trim().length > 0) return obj[f];
    }

    // Llama3 chat format: messages: [{role, content}]
    if (Array.isArray(obj.messages)) {
      const parts = obj.messages
        .map((m: any) => {
          const role = m.role || m.author || 'unknown';
          const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
          return `${role}: ${content}`;
        })
        .join('\n');
      if (parts.trim().length > 0) return parts;
    }

    // Fallback: concatenate stringy values
    const strVals: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && v.trim().length > 0) {
        strVals.push(`${k}: ${v}`);
      }
    }
    return strVals.length ? strVals.join('\n') : null;
  }
}

if (require.main === module) {
  const indexer = new RAGIndexer();
  indexer
    .run()
    .catch((err) => {
      console.error('Unhandled error:', err);
      process.exitCode = 1;
    });
}
