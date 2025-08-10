import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Safety: only update rows where encounterFhirId is null
  // Strategy: join CDI_Evidence -> CDI_Reviews -> Cases to pull encounterFhirId
  console.log('Starting backfill of CDI_Evidence.encounterFhirId for rows with NULL...');

  // Find candidates in manageable chunks
  const batchSize = 1000;
  let updated = 0;
  let skipped = 0;
  let offset = 0;

  for (;;) {
    const evidenceBatch = await prisma.cDI_Evidence.findMany({
      where: { encounterFhirId: null },
      select: { evidenceId: true, cdiReviewId: true },
      orderBy: { evidenceId: 'asc' },
      skip: offset,
      take: batchSize,
    });

    if (evidenceBatch.length === 0) break;

    // Fetch the related reviews and their cases for this batch
    const reviewIds = Array.from(new Set(evidenceBatch.map(e => e.cdiReviewId)));
    const reviews = await prisma.cDI_Reviews.findMany({
      where: { cdiReviewId: { in: reviewIds } },
      select: {
        cdiReviewId: true,
        case: { select: { encounterFhirId: true } },
      },
    });

    const reviewIdToEncounter = new Map<number, string | null>(
      reviews.map(r => [r.cdiReviewId, r.case?.encounterFhirId ?? null])
    );

    // Build updates
    const updates: Array<Promise<any>> = [];
    for (const ev of evidenceBatch) {
      const enc = reviewIdToEncounter.get(ev.cdiReviewId) || null;
      if (!enc) {
        skipped += 1;
        continue;
      }
      updates.push(
        prisma.cDI_Evidence.update({
          where: { evidenceId: ev.evidenceId },
          data: { encounterFhirId: enc },
        })
      );
    }

    const res = await Promise.allSettled(updates);
    updated += res.filter(r => r.status === 'fulfilled').length;
    const failed = res.filter(r => r.status === 'rejected').length;
    if (failed > 0) {
      console.warn(`Batch had ${failed} failures; continuing.`);
    }

    console.log(
      `Processed batch: candidates=${evidenceBatch.length}, updated=${res.filter(r => r.status === 'fulfilled').length}, skipped=${evidenceBatch.length - updates.length}`
    );

    // Advance window; since we update in-place and order by PK, we can keep moving by batch size
    offset += batchSize;
  }

  console.log(`Backfill complete. Updated=${updated}, Skipped(no encounter)=${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


