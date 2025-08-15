// Migrated from Prisma to Cosmos QueryRepository (Prisma fully removed in this file)
import express, { Request, Response, Router } from 'express';
import QueryRepository from '../repositories/query.repository';
import UserRepository from '../repositories/user.repository';
import { ragService } from '../services/rag.service';
import { log } from '../utils/logger';

const router: Router = express.Router();

// GET /api/queries - List all queries
router.get('/', async (req: Request, res: Response) => {
  try {
    const { limit = 50, page = 1, search } = req.query;
    const enriched = await Promise.all(
      (await QueryRepository.list({ 
        limit: Number(limit), 
        page: Number(page), 
        search: search as string 
      })).queries.map(async (query) => {
        const user = await UserRepository.get(query.userId);
        return {
          ...query,
          user: user ? { id: user.id, name: user.name, email: user.email } : null
        };
    }));
    res.json(enriched);
  } catch (error) {
    log.error('Error fetching queries', { error: error instanceof Error ? error.message : error });
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

    // Extract source content strings from RAG documents
    const sourceContents = ragResponse.sources.map(doc => doc.content);

    const updated = await QueryRepository.update(record.id, {
      answer: ragResponse.answer,
      confidence: ragResponse.confidence,
      sources: sourceContents,
      status: 'completed'
    });

    const user = await UserRepository.get(userId);
    res.status(201).json({ ...updated, user: user ? { id: user.id, name: user.name, email: user.email } : null });
  } catch (error) {
    log.error('Error creating query', { error: error instanceof Error ? error.message : error });
    res.status(500).json({ error: 'Failed to create query' });
  }
});

// GET /api/queries/:id - Get a specific query
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const query = await QueryRepository.get(id);
    let user: { id: string; name: string; email: string } | null = null;
    if (query?.userId) {
      const u = await UserRepository.get(query.userId);
      if (u) user = { id: u.id, name: u.name, email: u.email };
    }

    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    res.json(query);
  } catch (error) {
    log.error('Error fetching query', { error: error instanceof Error ? error.message : error, queryId: req.params.id });
    res.status(500).json({ error: 'Failed to fetch query' });
  }
});

// PUT /api/queries/:id - Update a query
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, status, context } = req.body;

    const updatePayload: Partial<{ question: string; status: string; context: Record<string, unknown>; updatedAt: string }> = { 
      updatedAt: new Date().toISOString() 
    };
    if (question) updatePayload.question = question;
    if (status) updatePayload.status = status;
    if (context) updatePayload.context = context;

    const updated = await QueryRepository.update(id, updatePayload);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    let user: { id: string; name: string; email: string } | null = null;
    if (updated.userId) {
      const u = await UserRepository.get(updated.userId);
      if (u) user = { id: u.id, name: u.name, email: u.email };
    }
    res.json({ ...updated, user });
  } catch (error) {
    log.error('Error updating query', { error: error instanceof Error ? error.message : error, queryId: req.params.id });
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
    log.error('Error deleting query', { error: error instanceof Error ? error.message : error, queryId: req.params.id });
    res.status(500).json({ error: 'Failed to delete query' });
  }
});

export default router;
