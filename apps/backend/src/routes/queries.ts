import { Router, Request, Response } from 'express';
import { PrismaClient } from '@billigent/database';
import { ragService } from '../services/rag.service';

const router = Router();
const prisma = new PrismaClient();

// GET /api/queries - Get all queries
router.get('/', async (req: Request, res: Response) => {
  try {
    const queries = await prisma.query.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    res.json(queries);
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
    const query = await prisma.query.create({
      data: {
        question,
        userId,
        status: 'processing',
        context: context || {}
      }
    });

    // Process with RAG service
    const ragResponse = await ragService.query(question);

    // Update query with results
    const updatedQuery = await prisma.query.update({
      where: { id: query.id },
      data: {
        answer: ragResponse.answer,
        confidence: ragResponse.confidence,
        sources: JSON.stringify(ragResponse.sources),
        status: 'completed'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json(updatedQuery);
  } catch (error) {
    console.error('Error creating query:', error);
    res.status(500).json({ error: 'Failed to create query' });
  }
});

// GET /api/queries/:id - Get a specific query
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const query = await prisma.query.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

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

    const query = await prisma.query.update({
      where: { id },
      data: {
        ...(question && { question }),
        ...(status && { status }),
        ...(context && { context }),
        updatedAt: new Date()
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(query);
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(500).json({ error: 'Failed to update query' });
  }
});

// DELETE /api/queries/:id - Delete a query
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.query.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting query:', error);
    res.status(500).json({ error: 'Failed to delete query' });
  }
});

export default router;
