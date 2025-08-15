// Migrated from Prisma to Cosmos QueryRepository (Prisma fully removed in this file)
import QueryRepository from '../repositories/query.repository';
import UserRepository from '../repositories/user.repository';
import { Request, Response, Router, type Router as ExpressRouter } from 'express';
import { ragService } from '../services/rag.service';

const router: ExpressRouter = Router();
// Removed Prisma client

// GET /api/queries - Get all queries
router.get('/', async (req: Request, res: Response) => {
  try {
    const { queries } = await QueryRepository.list({ limit: 100, page: 1 });
    // Enrich with user (simple in-memory join)
    const enriched = await Promise.all(queries.map(async q => {
      const user = await UserRepository.get(q.userId);
      return { ...q, user: user ? { id: user.id, name: user.name, email: user.email } : null };
    }));
    res.json(enriched);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
});

// POST /api/queries - Create a new query
router.post('/', async (req: Request, res: Response) => {
  try {
    const { question, userId, context } = req.body;

    if (!question || !userId) {
      return res.status(400).json({ error: 'Question and userId are required' });
    }

    // Create query record
    const record = await QueryRepository.create({ question, userId, context });

    const ragResponse = await ragService.query(question);

    const updated = await QueryRepository.update(record.id, {
      answer: ragResponse.answer,
      confidence: ragResponse.confidence,
      sources: ragResponse.sources,
      status: 'completed'
    });

    const user = await UserRepository.get(userId);
    res.status(201).json({ ...updated, user: user ? { id: user.id, name: user.name, email: user.email } : null });
  } catch (error) {
    console.error('Error creating query:', error);
    res.status(500).json({ error: 'Failed to create query' });
  }
});

// GET /api/queries/:id - Get a specific query
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const query = await QueryRepository.get(id);
    let user: any = null;
    if (query?.userId) {
      const u = await UserRepository.get(query.userId);
      if (u) user = { id: u.id, name: u.name, email: u.email };
    }

    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    res.json(query);
  } catch (error) {
    console.error('Error fetching query:', error);
    res.status(500).json({ error: 'Failed to fetch query' });
  }
});

// PUT /api/queries/:id - Update a query
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, status, context } = req.body;

    const updatePayload: any = { updatedAt: new Date() };
    if (question) updatePayload.question = question;
    if (status) updatePayload.status = status;
    if (context) updatePayload.context = context;

    const updated = await QueryRepository.update(id, updatePayload);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    let user: any = null;
    if (updated.userId) {
      const u = await UserRepository.get(updated.userId);
      if (u) user = { id: u.id, name: u.name, email: u.email };
    }
    res.json({ ...updated, user });
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(500).json({ error: 'Failed to update query' });
  }
});

// DELETE /api/queries/:id - Delete a query
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await QueryRepository.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting query:', error);
    res.status(500).json({ error: 'Failed to delete query' });
  }
});

export default router;
