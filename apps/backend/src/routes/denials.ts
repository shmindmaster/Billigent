// Purged Prisma-based denials route. Pending Cosmos implementation.
import { Router } from 'express';
const router = Router();
router.all('*', (_req,res) => res.status(501).json({ error: 'denials route removed during purge' }));
export default router;
