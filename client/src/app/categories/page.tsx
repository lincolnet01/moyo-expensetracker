'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';

interface Category {
  id: number;
  categoryName: string;
  categoryType: string;
  isCustom: boolean;
  parentCategoryId: number | null;
  subCategories: Category[];
  _count: { transactions: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const { showToast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      showToast('Category deleted', 'success');
      loadCategories();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to delete', 'error');
    }
  };

  const filtered = categories.filter(
    (c) => c.categoryType === activeTab && !c.parentCategoryId
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button size="sm" onClick={() => { setEditCategory(null); setShowModal(true); }}>
            + Add Category
          </Button>
        </div>

        <div className="flex bg-moyo-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('EXPENSE')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'EXPENSE' ? 'bg-white shadow-sm text-moyo-red' : 'text-moyo-gray-500'
            }`}
          >
            Expense Categories
          </button>
          <button
            onClick={() => setActiveTab('INCOME')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'INCOME' ? 'bg-white shadow-sm text-moyo-green' : 'text-moyo-gray-500'
            }`}
          >
            Income Categories
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-moyo-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((category) => (
              <Card key={category.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{category.categoryName}</h3>
                    <p className="text-xs text-moyo-gray-500 mt-1">
                      {category._count.transactions} transaction{category._count.transactions !== 1 ? 's' : ''}
                    </p>
                    {!category.isCustom && (
                      <span className="text-xs text-moyo-gray-400 mt-1 inline-block">System default</span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    category.categoryType === 'EXPENSE' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {category.categoryType}
                  </span>
                </div>

                {category.subCategories?.length > 0 && (
                  <div className="mt-3 pl-3 border-l-2 border-moyo-gray-200 space-y-1">
                    {category.subCategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between text-sm">
                        <span>{sub.categoryName}</span>
                        {sub.isCustom && (
                          <button onClick={() => handleDelete(sub.id)} className="text-moyo-red text-xs hover:underline">
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {category.isCustom && (
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="secondary" onClick={() => { setEditCategory(category); setShowModal(true); }}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(category.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        <CategoryModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditCategory(null); }}
          category={editCategory}
          categories={categories}
          onSuccess={() => { loadCategories(); setShowModal(false); setEditCategory(null); }}
          defaultType={activeTab}
        />
      </div>
    </AppLayout>
  );
}

function CategoryModal({
  isOpen, onClose, category, categories, onSuccess, defaultType,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  categories: Category[];
  onSuccess: () => void;
  defaultType: 'INCOME' | 'EXPENSE';
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>(defaultType);
  const [parentId, setParentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (category) {
      setName(category.categoryName);
      setType(category.categoryType as 'INCOME' | 'EXPENSE');
      setParentId(category.parentCategoryId?.toString() || '');
    } else {
      setName('');
      setType(defaultType);
      setParentId('');
    }
  }, [category, defaultType]);

  const parentOptions = categories.filter(
    (c) => c.categoryType === type && !c.parentCategoryId && c.id !== category?.id
  );

  const handleSubmit = async () => {
    if (!name) return;
    setSubmitting(true);
    try {
      const data: any = { categoryName: name, categoryType: type };
      if (parentId) data.parentCategoryId = parseInt(parentId);

      if (category) {
        await api.put(`/categories/${category.id}`, data);
        showToast('Category updated', 'success');
      } else {
        await api.post('/categories', data);
        showToast('Category created', 'success');
      }
      onSuccess();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to save', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add Category'}>
      <div className="space-y-4">
        <Input label="Category Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Office Supplies" />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-moyo-gray-700">Type</label>
          <select className="input-field" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-moyo-gray-700">Parent Category (optional)</label>
          <select className="input-field" value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">None (top level)</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.categoryName}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : category ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
