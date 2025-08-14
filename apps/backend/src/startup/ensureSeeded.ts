import { prisma } from '../services/prisma.service';

/**
 * Ensure baseline data exists. If no patients & no encounters & no users, invoke the database mini seed.
 * Current implementation only logs instructions; direct invocation requires refactor of seed script to export a function.
 */
export async function ensureSeeded() {
  try {
    const [patientCount, encounterCount, userCount] = await Promise.all([
      prisma.patient.count(),
      prisma.encounter.count(),
      prisma.user.count()
    ]);

    if (patientCount === 0 && encounterCount === 0 && userCount === 0) {
      console.log('[startup] No baseline data detected. Running full seed...');
      try {
        // Dynamically import to avoid adding cost to cold path when data already exists
        const { runFullSeed } = await import('@billigent/database/prisma/seed');
        await runFullSeed();
        console.log('[startup] Seed completed successfully.');
      } catch (seedErr) {
        console.error('[startup] Automatic seed failed:', seedErr);
      }
    } else {
      console.log(`[startup] Data present (patients=${patientCount}, encounters=${encounterCount}, users=${userCount})`);
    }
  } catch (e) {
    console.warn('[startup] ensureSeeded error:', e instanceof Error ? e.message : e);
  }
}

export default ensureSeeded;