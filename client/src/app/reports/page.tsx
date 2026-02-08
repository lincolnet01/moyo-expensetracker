'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#1E88E5', '#43A047', '#E53935', '#FB8C00', '#8E24AA', '#00ACC1', '#F4511E', '#3949AB', '#7CB342', '#D81B60'];

interface Summary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
}

interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  categoryType: string;
  total: number;
  count: number;
}

interface TrendData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

type DatePreset = 'this-month' | 'last-month' | 'last-3' | 'ytd' | 'custom';

export default function ReportsPage() {
  const [preset, setPreset] = useState<DatePreset>('this-month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [breakdownType, setBreakdownType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const now = new Date();
    let start: Date;
    let end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    switch (preset) {
      case 'this-month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last-month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'last-3':
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case 'ytd':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        return;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, [preset]);

  useEffect(() => {
    if (startDate && endDate) {
      loadReports();
    }
  }, [startDate, endDate, breakdownType]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params = `startDate=${startDate}&endDate=${endDate}`;
      const [summaryRes, breakdownRes, trendsRes] = await Promise.all([
        api.get(`/reports/summary?${params}`),
        api.get(`/reports/category-breakdown?${params}&type=${breakdownType}`),
        api.get(`/reports/trends?months=12`),
      ]);
      setSummary(summaryRes.data);
      setBreakdown(breakdownRes.data);
      setTrends(trendsRes.data);
    } catch {
      showToast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = `startDate=${startDate}&endDate=${endDate}`;
      const res = await api.get(`/reports/export-csv?${params}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('CSV exported', 'success');
    } catch {
      showToast('Export failed', 'error');
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const presets: { key: DatePreset; label: string }[] = [
    { key: 'this-month', label: 'This Month' },
    { key: 'last-month', label: 'Last Month' },
    { key: 'last-3', label: 'Last 3 Months' },
    { key: 'ytd', label: 'Year to Date' },
    { key: 'custom', label: 'Custom' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reports</h1>
          <Button size="sm" variant="secondary" onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>

        <Card>
          <div className="flex flex-wrap gap-2 items-center">
            {presets.map((p) => (
              <button
                key={p.key}
                onClick={() => setPreset(p.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  preset === p.key ? 'bg-moyo-blue text-white' : 'bg-moyo-gray-100 text-moyo-gray-600 hover:bg-moyo-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
            {preset === 'custom' && (
              <div className="flex gap-2 ml-2">
                <input type="date" className="input-field text-sm w-auto" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" className="input-field text-sm w-auto" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            )}
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12 text-moyo-gray-500">Loading reports...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p className="text-sm text-moyo-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-moyo-green mt-1">{formatCurrency(summary?.totalIncome || 0)}</p>
              </Card>
              <Card>
                <p className="text-sm text-moyo-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-moyo-red mt-1">{formatCurrency(summary?.totalExpenses || 0)}</p>
              </Card>
              <Card>
                <p className="text-sm text-moyo-gray-500">Net Balance</p>
                <p className={`text-2xl font-bold mt-1 ${(summary?.netBalance || 0) >= 0 ? 'text-moyo-green' : 'text-moyo-red'}`}>
                  {formatCurrency(summary?.netBalance || 0)}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Category Breakdown</h2>
                  <div className="flex bg-moyo-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setBreakdownType('EXPENSE')}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${breakdownType === 'EXPENSE' ? 'bg-white shadow-sm' : ''}`}
                    >
                      Expenses
                    </button>
                    <button
                      onClick={() => setBreakdownType('INCOME')}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${breakdownType === 'INCOME' ? 'bg-white shadow-sm' : ''}`}
                    >
                      Income
                    </button>
                  </div>
                </div>
                {breakdown.length === 0 ? (
                  <p className="text-moyo-gray-500 text-sm text-center py-8">No data for this period</p>
                ) : (
                  <>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={breakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="total"
                            nameKey="categoryName"
                            label={({ categoryName, percent }) =>
                              `${categoryName} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {breakdown.map((_, index) => (
                              <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      {breakdown.map((item, index) => (
                        <div key={item.categoryId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span>{item.categoryName}</span>
                            <span className="text-moyo-gray-400">({item.count})</span>
                          </div>
                          <span className="font-medium">{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card>

              <Card>
                <h2 className="text-lg font-semibold mb-4">Trend Analysis</h2>
                {trends.length === 0 ? (
                  <p className="text-moyo-gray-500 text-sm text-center py-8">No data available</p>
                ) : (
                  <div className="h-80">
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
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
