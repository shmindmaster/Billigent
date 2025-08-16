// Using Cosmos-backed UserRepository
import { Request, Response, Router } from 'express';
import UserRepository from '../repositories/user.repository';
import { log } from '../utils/logger';

const router: Router = Router();

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const { users } = await UserRepository.list({});
    res.json(users);
  } catch (error) {
    log.error('Error fetching users', { error: error instanceof Error ? error.message : error });
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const user = await UserRepository.create({ name, email, role });
    res.status(201).json(user);
  } catch (error) {
    log.error('Error creating user', { error: error instanceof Error ? error.message : error, userData: { name: req.body.name, email: req.body.email, role: req.body.role } });
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/users/:id - Get a specific user
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await UserRepository.get(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    log.error('Error fetching user', { error: error instanceof Error ? error.message : error, userId: req.params.id });
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/users/:id - Update a user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await UserRepository.update(id, { name, email, role });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    log.error('Error updating user', { error: error instanceof Error ? error.message : error, userId: req.params.id, updateData: { name: req.body.name, email: req.body.email, role: req.body.role } });
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const ok = await UserRepository.delete(id);
    if (!ok) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (error) {
    log.error('Error deleting user', { error: error instanceof Error ? error.message : error, userId: req.params.id });
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
