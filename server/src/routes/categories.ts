import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

const createCategorySchema = z.object({
  categoryName: z.string().min(1).max(100),
  categoryType: z.enum(['INCOME', 'EXPENSE']),
  parentCategoryId: z.number().optional(),
});

const updateCategorySchema = z.object({
  categoryName: z.string().min(1).max(100).optional(),
  categoryType: z.enum(['INCOME', 'EXPENSE']).optional(),
  parentCategoryId: z.number().nullable().optional(),
});

// GET /api/categories
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { type } = req.query;

    const where: any = {
      OR: [{ userId: null }, { userId: req.userId! }],
    };

    if (type === 'INCOME' || type === 'EXPENSE') {
      where.categoryType = type;
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        subCategories: true,
        _count: { select: { transactions: true } },
      },
      orderBy: [{ categoryType: 'asc' }, { categoryName: 'asc' }],
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories
router.post('/', validate(createCategorySchema), async (req: AuthRequest, res) => {
  try {
    const category = await prisma.category.create({
      data: {
        ...req.body,
        userId: req.userId!,
        isCustom: true,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id
router.put('/:id', validate(updateCategorySchema), async (req: AuthRequest, res) => {
  try {
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(req.params.id),
        OR: [{ userId: req.userId! }, { userId: null, isCustom: false }],
      },
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (!category.isCustom) {
      res.status(403).json({ error: 'Cannot modify system default categories' });
      return;
    }

    const updated = await prisma.category.update({
      where: { id: category.id },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const category = await prisma.category.findFirst({
      where: { id: parseInt(req.params.id), userId: req.userId! },
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (!category.isCustom) {
      res.status(403).json({ error: 'Cannot delete system default categories' });
      return;
    }

    const transactionCount = await prisma.transaction.count({
      where: { categoryId: category.id },
    });

    if (transactionCount > 0) {
      res.status(400).json({
        error: `Cannot delete: ${transactionCount} transaction(s) use this category`,
      });
      return;
    }

    await prisma.category.delete({ where: { id: category.id } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
