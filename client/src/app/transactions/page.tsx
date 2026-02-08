'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';

interface Transaction {
  id: number;
  transactionDate: string;
  transactionType: string;
  amount: number;
  description: string;
  categoryId: number;
  sourceId: number;
  category: { id: number; categoryName: string; categoryType: string };
  source: { id: number; sourceName: string; sourceType: string };
}

interface Category {
  id: number;
  categoryName: string;
  categoryType: string;
}

interface Source {
  id: number;
  sourceName: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'' | 'INCOME' | 'EXPENSE'>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
    api.get('/income-sources').then((r) => setSources(r.data));
  }, []);

  const loadTransactions = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab) params.set('type', activeTab);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (filterCategory) params.set('categoryId', filterCategory);
      if (filterSource) params.set('sourceId', filterSource);
      params.set('page', page.toString());
      params.set('limit', '15');

      const res = await api.get(`/transactions?${params.toString()}`);
      setTransactions(res.data.transactions);
      setPagination(res.data.pagination);
    } catch {
      showToast('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, startDate, endDate, filterCategory, filterSource, showToast]);

  useEffect(() => {
    loadTransactions(1);
  }, [loadTransactions]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      showToast('Transaction deleted', 'success');
      loadTransactions(pagination.page);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to delete', 'error');
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const tabs = [
    { key: '', label: 'All' },
    { key: 'INCOME', label: 'Income' },
    { key: 'EXPENSE', label: 'Expenses' },
  ] as const;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <Button size="sm" onClick={() => { setEditTransaction(null); setShowModal(true); }}>
            + Add Transaction
          </Button>
        </div>

        <Card>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex bg-moyo-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key ? 'bg-white shadow-sm text-moyo-blue' : 'text-moyo-gray-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="date" className="input-field text-sm w-auto" value={startDate}
                onChange={(e) => setStartDate(e.target.value)} placeholder="Start"
              />
              <input
                type="date" className="input-field text-sm w-auto" value={endDate}
                onChange={(e) => setEndDate(e.target.value)} placeholder="End"
              />
              <select className="input-field text-sm w-auto" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.categoryName}</option>
                ))}
              </select>
              <select className="input-field text-sm w-auto" value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
                <option value="">All Sources</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>{s.sourceName}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-moyo-gray-500">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-moyo-gray-500">No transactions found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-moyo-gray-200 text-left text-moyo-gray-500">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Description</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Source</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-moyo-gray-100">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-moyo-gray-50">
                        <td className="py-3">{formatDate(t.transactionDate)}</td>
                        <td className="py-3">{t.description || '-'}</td>
                        <td className="py-3">
                          <span className="text-xs bg-moyo-gray-100 px-2 py-0.5 rounded-full">
                            {t.category.categoryName}
                          </span>
                        </td>
                        <td className="py-3">{t.source.sourceName}</td>
                        <td className={`py-3 text-right font-medium ${t.transactionType === 'INCOME' ? 'text-moyo-green' : 'text-moyo-red'}`}>
                          {t.transactionType === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => { setEditTransaction(t); setShowModal(true); }}
                            className="text-moyo-blue hover:underline text-xs mr-2"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDelete(t.id)} className="text-moyo-red hover:underline text-xs">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-moyo-gray-100">
                  <span className="text-sm text-moyo-gray-500">
                    Showing {transactions.length} of {pagination.total}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm" variant="secondary"
                      disabled={pagination.page <= 1}
                      onClick={() => loadTransactions(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm" variant="secondary"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => loadTransactions(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        <TransactionModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditTransaction(null); }}
          transaction={editTransaction}
          categories={categories}
          sources={sources}
          onSuccess={() => { loadTransactions(pagination.page); setShowModal(false); setEditTransaction(null); }}
        />
      </div>
    </AppLayout>
  );
}

function TransactionModal({
  isOpen, onClose, transaction, categories, sources, onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  categories: Category[];
  sources: Source[];
  onSuccess: () => void;
}) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (transaction) {
      setType(transaction.transactionType as 'INCOME' | 'EXPENSE');
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setCategoryId(transaction.categoryId.toString());
      setSourceId(transaction.sourceId.toString());
      setDate(new Date(transaction.transactionDate).toISOString().split('T')[0]);
    } else {
      setType('EXPENSE');
      setAmount('');
      setDescription('');
      setCategoryId('');
      setSourceId('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [transaction]);

  const filteredCategories = categories.filter((c) => c.categoryType === type);

  const handleSubmit = async () => {
    if (!amount || !categoryId || !sourceId) return;
    setSubmitting(true);
    try {
      const data = {
        transactionDate: date,
        transactionType: type,
        amount: parseFloat(amount),
        description,
        categoryId: parseInt(categoryId),
        sourceId: parseInt(sourceId),
      };

      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, data);
        showToast('Transaction updated', 'success');
      } else {
        await api.post('/transactions', data);
        showToast('Transaction added', 'success');
      }
      onSuccess();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to save', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={transaction ? 'Edit Transaction' : 'Add Transaction'}>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-moyo-gray-700">Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => { setType('EXPENSE'); setCategoryId(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'EXPENSE' ? 'bg-moyo-red text-white' : 'bg-moyo-gray-100 text-moyo-gray-600'}`}
            >
              Expense
            </button>
            <button
              onClick={() => { setType('INCOME'); setCategoryId(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'INCOME' ? 'bg-moyo-green text-white' : 'bg-moyo-gray-100 text-moyo-gray-600'}`}
            >
              Income
            </button>
          </div>
        </div>
        <Input label="Amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-moyo-gray-700">Category</label>
          <select className="input-field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Select category</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.categoryName}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-moyo-gray-700">Source</label>
          <select className="input-field" value={sourceId} onChange={(e) => setSourceId(e.target.value)} required>
            <option value="">Select source</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>{s.sourceName}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : transaction ? 'Update' : 'Add'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
