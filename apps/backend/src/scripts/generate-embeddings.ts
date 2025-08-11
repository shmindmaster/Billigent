import { PrismaClient } from '@billigent/database';
import 'dotenv/config';
import OpenAI from 'openai';

// Azure OpenAI config
const openaiEndpointBase = process.env.AZURE_OPENAI_ENDPOINT || '';
const openaiKey = process.env.AZURE_OPENAI_API_KEY || '';
const openaiApiVersion = process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview';
const embeddingModel = process.env.AZURE_OPENAI_EMBED_MODEL || 'text-embedding-3-small';

// Build base URL so that /embeddings resolves to deployments/<model>/embeddings
const embeddingDeploymentBase = `${openaiEndpointBase.replace(/\/$/, '')}/openai/deployments/`;

function getEmbeddingClient(): OpenAI {
  if (!openaiEndpointBase || !openaiKey) {
    throw new Error('Missing AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_API_KEY');
  }
  const baseURL = `${embeddingDeploymentBase}${encodeURIComponent(embeddingModel)}`;
  return new OpenAI({
    apiKey: openaiKey,
    baseURL,
    defaultHeaders: { 'api-key': openaiKey },
    defaultQuery: { 'api-version': openaiApiVersion },
  } as any);
}

// Prisma client
const prisma = new PrismaClient();

// Helpers
function float32ArrayToBuffer(arr: number[]): Buffer {
  const f32 = new Float32Array(arr);
  return Buffer.from(new Uint8Array(f32.buffer));
}

async function generateEmbeddingForText(client: OpenAI, text: string): Promise<number[] | null> {
  try {
    const resp = await client.embeddings.create({ model: embeddingModel, input: text });
    const vec = (resp as any)?.data?.[0]?.embedding as number[] | undefined;
    return Array.isArray(vec) ? vec : null;
  } catch (err) {
    console.error('Embedding API error:', err);
    return null;
  }
}

async function processBatch(skip: number, take: number, client: OpenAI): Promise<number> {
  const records = await prisma.preBillAnalysis.findMany({
    // Cast where to any to avoid type errors before prisma generate
    where: { embedding: null } as any,
    orderBy: { evidenceId: 'asc' },
    skip,
    take,
    select: { evidenceId: true, description: true },
  });

  if (records.length === 0) return 0;

  let processed = 0;
  for (const rec of records) {
    try {
      const text = (rec.description || '').toString().slice(0, 8000);
      if (!text) {
        console.warn(`Skipping evidenceId=${rec.evidenceId}: empty description`);
        continue;
      }
      const vec = await generateEmbeddingForText(client, text);
      if (!vec) {
        console.warn(`No embedding generated for evidenceId=${rec.evidenceId}`);
        continue;
      }
      const buf = float32ArrayToBuffer(vec);
      await prisma.preBillAnalysis.update({
        where: { evidenceId: rec.evidenceId || undefined },
        // Cast data to any to avoid type errors until Prisma client is regenerated
        data: { embedding: buf } as any,
      });
      processed++;
      if (processed % 10 === 0) {
        console.log(`Updated ${processed}/${records.length} in current batch (skip=${skip})...`);
      }
    } catch (err) {
      console.error(`Failed to process evidenceId=${rec.evidenceId}:`, err);
    }
  }

  return records.length;
}

async function main() {
  const BATCH = parseInt(process.env.EMBED_BATCH_SIZE || '100', 10);
  console.log(`Starting embeddings generation in batches of ${BATCH}...`);

  const client = getEmbeddingClient();

  let skip = 0;
  let total = 0;
  while (true) {
    console.log(`Fetching batch: skip=${skip}, take=${BATCH}`);
    const count = await processBatch(skip, BATCH, client);
    if (count === 0) break;
    total += count;
    skip += count; // advance window; avoids re-querying already processed ids
  }

  console.log(`Done. Total records updated with embeddings: ${total}`);
}

main()
  .catch((e) => {
    console.error('Fatal error in embeddings generation:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

