'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';

interface IncomeSource {
  id: number;
  sourceName: string;
  sourceType: string;
  initialBalance: number;
  isActive: boolean;
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export default function IncomeSourcesPage() {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSource, setEditSource] = useState<IncomeSource | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const res = await api.get('/income-sources');
      setSources(res.data);
    } catch {
      showToast('Failed to load income sources', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this source?')) return;
    try {
      await api.delete(`/income-sources/${id}`);
      showToast('Source deleted', 'success');
      loadSources();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to delete', 'error');
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Income Sources</h1>
          <Button size="sm" onClick={() => { setEditSource(null); setShowModal(true); }}>
            + Add Source
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-moyo-gray-500">Loading...</div>
        ) : sources.length === 0 ? (
          <Card>
            <p className="text-moyo-gray-500 text-center py-8">No income sources yet. Add your first one!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((source) => (
              <Card key={source.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{source.sourceName}</h3>
                    <span className="text-xs bg-moyo-gray-100 text-moyo-gray-600 px-2 py-0.5 rounded-full">
                      {source.sourceType}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${source.isActive ? 'bg-green-100 text-green-700' : 'bg-moyo-gray-100 text-moyo-gray-500'}`}>
                    {source.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-moyo-gray-500">Initial Balance</span>
                    <span>{formatCurrency(source.initialBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-moyo-gray-500">Total Income</span>
                    <span className="text-moyo-green">{formatCurrency(source.totalIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-moyo-gray-500">Total Expenses</span>
                    <span className="text-moyo-red">{formatCurrency(source.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-moyo-gray-100 pt-1 mt-1">
                    <span>Current Balance</span>
                    <span className={source.currentBalance >= 0 ? 'text-moyo-green' : 'text-moyo-red'}>
                      {formatCurrency(source.currentBalance)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="secondary" onClick={() => { setEditSource(source); setShowModal(true); }}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(source.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <SourceModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditSource(null); }}
          source={editSource}
          onSuccess={() => { loadSources(); setShowModal(false); setEditSource(null); }}
        />
      </div>
    </AppLayout>
  );
}

function SourceModal({
  isOpen, onClose, source, onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  source: IncomeSource | null;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState('BANK');
  const [balance, setBalance] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (source) {
      setName(source.sourceName);
      setType(source.sourceType);
      setBalance(source.initialBalance.toString());
      setIsActive(source.isActive);
    } else {
      setName('');
      setType('BANK');
      setBalance('0');
      setIsActive(true);
    }
  }, [source]);

  const handleSubmit = async () => {
    if (!name) return;
    setSubmitting(true);
    try {
      const data = { sourceName: name, sourceType: type, initialBalance: parseFloat(balance), isActive };
      if (source) {
        await api.put(`/income-sources/${source.id}`, data);
        showToast('Source updated', 'success');
      } else {
        await api.post('/income-sources', data);
        showToast('Source created', 'success');
      }
      onSuccess();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to save', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={source ? 'Edit Source' : 'Add Income Source'}>
      <div className="space-y-4">
        <Input label="Source Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Business Account" />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-moyo-gray-700">Type</label>
          <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="BANK">Bank</option>
            <option value="CASH">Cash</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <Input label="Initial Balance" type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} />
        {source && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded" />
            Active
          </label>
        )}
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : source ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
