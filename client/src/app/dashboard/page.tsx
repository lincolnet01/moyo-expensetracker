'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface Summary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
  activeSources: number;
}

interface Transaction {
  id: number;
  transactionDate: string;
  transactionType: string;
  amount: number;
  description: string;
  category: { categoryName: string };
  source: { sourceName: string };
}

interface TrendData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryRes, transRes, trendsRes] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/transactions?limit=5'),
        api.get('/reports/trends?months=6'),
      ]);
      setSummary(summaryRes.data);
      setRecentTransactions(transRes.data.transactions);
      setTrends(trendsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => { setAddType('INCOME'); setShowAddModal(true); }}
            >
              + Add Income
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => { setAddType('EXPENSE'); setShowAddModal(true); }}
            >
              + Add Expense
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-moyo-gray-500">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <p className="text-sm text-moyo-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-moyo-green mt-1">
                  {formatCurrency(summary?.totalIncome || 0)}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-moyo-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-moyo-red mt-1">
                  {formatCurrency(summary?.totalExpenses || 0)}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-moyo-gray-500">Net Balance</p>
                <p className={`text-2xl font-bold mt-1 ${(summary?.netBalance || 0) >= 0 ? 'text-moyo-green' : 'text-moyo-red'}`}>
                  {formatCurrency(summary?.netBalance || 0)}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-moyo-gray-500">Active Sources</p>
                <p className="text-2xl font-bold text-moyo-blue mt-1">
                  {summary?.activeSources || 0}
                </p>
              </Card>
            </div>

            {trends.length > 0 && (
              <Card>
                <h2 className="text-lg font-semibold mb-4">Monthly Trend</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#43A047" name="Income" strokeWidth={2} />
                      <Line type="monotone" dataKey="expenses" stroke="#E53935" name="Expenses" strokeWidth={2} />
                      <Line type="monotone" dataKey="net" stroke="#1E88E5" name="Net" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            <Card>
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              {recentTransactions.length === 0 ? (
                <p className="text-moyo-gray-500 text-sm py-4">No transactions yet. Add your first one!</p>
              ) : (
                <div className="divide-y divide-moyo-gray-100">
                  {recentTransactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-sm">{t.description || t.category.categoryName}</p>
                        <p className="text-xs text-moyo-gray-500">
                          {t.category.categoryName} &middot; {t.source.sourceName} &middot; {formatDate(t.transactionDate)}
                        </p>
                      </div>
                      <span className={`font-semibold ${t.transactionType === 'INCOME' ? 'text-moyo-green' : 'text-moyo-red'}`}>
                        {t.transactionType === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}

        <QuickAddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          type={addType}
          onSuccess={loadDashboard}
        />
      </div>
    </AppLayout>
  );
}

function QuickAddModal({
  isOpen, onClose, type, onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: 'INCOME' | 'EXPENSE';
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      api.get(`/categories?type=${type}`).then((r) => setCategories(r.data));
      api.get('/income-sources').then((r) => setSources(r.data));
    }
  }, [isOpen, type]);

  const handleSubmit = async () => {
    if (!amount || !categoryId || !sourceId) return;
    setSubmitting(true);
    try {
      await api.post('/transactions', {
        transactionDate: date,
        transactionType: type,
        amount: parseFloat(amount),
        description,
        categoryId: parseInt(categoryId),
        sourceId: parseInt(sourceId),
      });
      showToast(`${type === 'INCOME' ? 'Income' : 'Expense'} added!`, 'success');
      onSuccess();
      onClose();
      setAmount('');
      setDescription('');
      setCategoryId('');
      setSourceId('');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to add transaction', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add ${type === 'INCOME' ? 'Income' : 'Expense'}`}>
      <div className="space-y-4">
        <Input label="Amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-moyo-gray-700">Category</label>
          <select className="input-field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.categoryName}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-moyo-gray-700">Source</label>
          <select className="input-field" value={sourceId} onChange={(e) => setSourceId(e.target.value)} required>
            <option value="">Select source</option>
            {sources.map((s: any) => (
              <option key={s.id} value={s.id}>{s.sourceName}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
