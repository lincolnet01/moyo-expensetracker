import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

const createTransactionSchema = z.object({
  transactionDate: z.string().transform((s) => new Date(s)),
  transactionType: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive(),
  description: z.string().default(''),
  categoryId: z.number(),
  sourceId: z.number(),
});

const updateTransactionSchema = z.object({
  transactionDate: z.string().transform((s) => new Date(s)).optional(),
  transactionType: z.enum(['INCOME', 'EXPENSE']).optional(),
  amount: z.number().positive().optional(),
  description: z.string().optional(),
  categoryId: z.number().optional(),
  sourceId: z.number().optional(),
});

// GET /api/transactions
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { type, categoryId, sourceId, startDate, endDate, page = '1', limit = '20' } = req.query;

    const where: any = { userId: req.userId! };

    if (type === 'INCOME' || type === 'EXPENSE') {
      where.transactionType = type;
    }
    if (categoryId) {
      where.categoryId = parseInt(categoryId as string);
    }
    if (sourceId) {
      where.sourceId = parseInt(sourceId as string);
    }
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = new Date(startDate as string);
      if (endDate) where.transactionDate.lte = new Date(endDate as string);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: { select: { id: true, categoryName: true, categoryType: true } },
          source: { select: { id: true, sourceName: true, sourceType: true } },
        },
        orderBy: { transactionDate: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST /api/transactions
router.post('/', validate(createTransactionSchema), async (req: AuthRequest, res) => {
  try {
    const transaction = await prisma.transaction.create({
      data: { ...req.body, userId: req.userId! },
      include: {
        category: { select: { id: true, categoryName: true, categoryType: true } },
        source: { select: { id: true, sourceName: true, sourceType: true } },
      },
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// PUT /api/transactions/:id
router.put('/:id', validate(updateTransactionSchema), async (req: AuthRequest, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(req.params.id as string), userId: req.userId! },
    });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    const updated = await prisma.transaction.update({
      where: { id: transaction.id },
      data: req.body,
      include: {
        category: { select: { id: true, categoryName: true, categoryType: true } },
        source: { select: { id: true, sourceName: true, sourceType: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(req.params.id as string), userId: req.userId! },
    });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    await prisma.transaction.delete({ where: { id: transaction.id } });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export default router;
