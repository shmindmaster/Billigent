// Purged Prisma-based denials_fixed route. Pending Cosmos implementation.
import { Router } from 'express';
const router = Router();
router.all('*', (_req,res) => res.status(501).json({ error: 'denials_fixed route removed during purge' }));
export default router;
