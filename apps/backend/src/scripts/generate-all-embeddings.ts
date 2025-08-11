import { PrismaClient } from '@billigent/database';
import 'dotenv/config';
import { generateEmbedding } from '../services/embedding.service';

const prisma = new PrismaClient();

function float32ArrayToBuffer(arr: number[]): Buffer {
  const f32 = new Float32Array(arr);
  return Buffer.from(f32.buffer);
}

async function processBatch(skip: number, take: number): Promise<number> {
  const records = await prisma.preBillAnalysis.findMany({
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
        processed++;
        continue;
      }
      const vec = await generateEmbedding(text);
      const buf = float32ArrayToBuffer(vec);
      await prisma.preBillAnalysis.update({
        where: { evidenceId: rec.evidenceId || undefined },
        data: { embedding: buf } as any,
      });
      processed++;
    } catch (err) {
      console.error(`Failed evidenceId=${rec.evidenceId}:`, err);
    }
  }
  return processed;
}

async function main() {
  const take = Math.max(1, Math.min(500, parseInt(process.env.EMBED_BATCH_SIZE || '100', 10)));
  console.log(`Starting batch embedding generation… batchSize=${take}`);

  let skip = 0;
  let totalProcessed = 0;
  let batchNo = 1;

  while (true) {
    console.log(`Processing batch ${batchNo} (skip=${skip})…`);
    const processed = await processBatch(skip, take);
    if (processed === 0) break;
    totalProcessed += processed;
    skip += take;
    batchNo++;
  }

  console.log(`Done. Total records updated: ${totalProcessed}`);
}

main()
  .catch((e) => {
    console.error('Embedding job failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

