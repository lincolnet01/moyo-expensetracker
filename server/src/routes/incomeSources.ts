import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

const createSourceSchema = z.object({
  sourceName: z.string().min(1).max(100),
  sourceType: z.enum(['BANK', 'CASH', 'OTHER']).default('BANK'),
  initialBalance: z.number().default(0),
});

const updateSourceSchema = z.object({
  sourceName: z.string().min(1).max(100).optional(),
  sourceType: z.enum(['BANK', 'CASH', 'OTHER']).optional(),
  initialBalance: z.number().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/income-sources
router.get('/', async (req: AuthRequest, res) => {
  try {
    const sources = await prisma.incomeSource.findMany({
      where: { userId: req.userId! },
      include: {
        transactions: {
          select: { amount: true, transactionType: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const sourcesWithBalance = sources.map((source) => {
      const totalIncome = source.transactions
        .filter((t) => t.transactionType === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = source.transactions
        .filter((t) => t.transactionType === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      const currentBalance = source.initialBalance + totalIncome - totalExpenses;

      const { transactions: _, ...sourceData } = source;
      return { ...sourceData, currentBalance, totalIncome, totalExpenses };
    });

    res.json(sourcesWithBalance);
  } catch (error) {
    console.error('Get sources error:', error);
    res.status(500).json({ error: 'Failed to fetch income sources' });
  }
});

// POST /api/income-sources
router.post('/', validate(createSourceSchema), async (req: AuthRequest, res) => {
  try {
    const source = await prisma.incomeSource.create({
      data: { ...req.body, userId: req.userId! },
    });
    res.status(201).json(source);
  } catch (error) {
    console.error('Create source error:', error);
    res.status(500).json({ error: 'Failed to create income source' });
  }
});

// PUT /api/income-sources/:id
router.put('/:id', validate(updateSourceSchema), async (req: AuthRequest, res) => {
  try {
    const source = await prisma.incomeSource.findFirst({
      where: { id: parseInt(req.params.id as string), userId: req.userId! },
    });

    if (!source) {
      res.status(404).json({ error: 'Income source not found' });
      return;
    }

    const updated = await prisma.incomeSource.update({
      where: { id: source.id },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    console.error('Update source error:', error);
    res.status(500).json({ error: 'Failed to update income source' });
  }
});

// DELETE /api/income-sources/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const source = await prisma.incomeSource.findFirst({
      where: { id: parseInt(req.params.id as string), userId: req.userId! },
    });

    if (!source) {
      res.status(404).json({ error: 'Income source not found' });
      return;
    }

    const transactionCount = await prisma.transaction.count({
      where: { sourceId: source.id },
    });

    if (transactionCount > 0) {
      res.status(400).json({
        error: `Cannot delete: ${transactionCount} transaction(s) are linked to this source`,
      });
      return;
    }

    await prisma.incomeSource.delete({ where: { id: source.id } });
    res.json({ message: 'Income source deleted' });
  } catch (error) {
    console.error('Delete source error:', error);
    res.status(500).json({ error: 'Failed to delete income source' });
  }
});

export default router;
