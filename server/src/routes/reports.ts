import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/reports/summary
router.get('/summary', async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = { userId: req.userId! };
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = new Date(startDate as string);
      if (endDate) where.transactionDate.lte = new Date(endDate as string);
    }

    const transactions = await prisma.transaction.findMany({ where });

    const totalIncome = transactions
      .filter((t) => t.transactionType === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.transactionType === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const activeSources = await prisma.incomeSource.count({
      where: { userId: req.userId!, isActive: true },
    });

    res.json({
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      transactionCount: transactions.length,
      activeSources,
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// GET /api/reports/category-breakdown
router.get('/category-breakdown', async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    const where: any = { userId: req.userId! };
    if (type === 'INCOME' || type === 'EXPENSE') {
      where.transactionType = type;
    }
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = new Date(startDate as string);
      if (endDate) where.transactionDate.lte = new Date(endDate as string);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: { select: { id: true, categoryName: true, categoryType: true } } },
    });

    const breakdown = new Map<number, { categoryName: string; categoryType: string; total: number; count: number }>();

    for (const t of transactions) {
      const existing = breakdown.get(t.categoryId);
      if (existing) {
        existing.total += t.amount;
        existing.count += 1;
      } else {
        breakdown.set(t.categoryId, {
          categoryName: t.category.categoryName,
          categoryType: t.category.categoryType,
          total: t.amount,
          count: 1,
        });
      }
    }

    const result = Array.from(breakdown.entries())
      .map(([categoryId, data]) => ({ categoryId, ...data }))
      .sort((a, b) => b.total - a.total);

    res.json(result);
  } catch (error) {
    console.error('Category breakdown error:', error);
    res.status(500).json({ error: 'Failed to generate category breakdown' });
  }
});

// GET /api/reports/trends
router.get('/trends', async (req: AuthRequest, res) => {
  try {
    const { months = '6' } = req.query;
    const monthCount = parseInt(months as string);

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthCount);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId!,
        transactionDate: { gte: startDate },
      },
      orderBy: { transactionDate: 'asc' },
    });

    const monthlyData = new Map<string, { income: number; expenses: number }>();

    for (const t of transactions) {
      const date = new Date(t.transactionDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData.has(key)) {
        monthlyData.set(key, { income: 0, expenses: 0 });
      }

      const data = monthlyData.get(key)!;
      if (t.transactionType === 'INCOME') {
        data.income += t.amount;
      } else {
        data.expenses += t.amount;
      }
    }

    const result = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json(result);
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ error: 'Failed to generate trends' });
  }
});

// GET /api/reports/export-csv
router.get('/export-csv', async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    const where: any = { userId: req.userId! };
    if (type === 'INCOME' || type === 'EXPENSE') {
      where.transactionType = type;
    }
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = new Date(startDate as string);
      if (endDate) where.transactionDate.lte = new Date(endDate as string);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: { select: { categoryName: true } },
        source: { select: { sourceName: true } },
      },
      orderBy: { transactionDate: 'desc' },
    });

    const csvHeader = 'Date,Type,Amount,Category,Source,Description\n';
    const csvRows = transactions.map((t) => {
      const date = new Date(t.transactionDate).toISOString().split('T')[0];
      const desc = t.description.replace(/"/g, '""');
      return `${date},${t.transactionType},${t.amount},"${t.category.categoryName}","${t.source.sourceName}","${desc}"`;
    });

    const csv = csvHeader + csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

export default router;
