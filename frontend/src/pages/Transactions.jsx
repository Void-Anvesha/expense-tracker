import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Transactions() {
  const { user } = useAuth();
  const {
    transactions,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    recurringTemplates,
    importTransactions,
    getCategorySuggestion,
    categoryRules,
    addCategoryRule,
    deleteCategoryRule,
    stopRecurringTemplate
  } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    merchant: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    isRecurring: false,
    recurrence: 'monthly'
  });
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [ruleForm, setRuleForm] = useState({ keyword: '', category: 'Food' });
  const [csvError, setCsvError] = useState('');
  const fileInputRef = useRef(null);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Housing', 'Salary', 'Freelance', 'Shopping', 'Health', 'Education', 'Other'];

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const suggestion = getCategorySuggestion(formData.merchant, formData.notes);
    setSuggestedCategory(suggestion);
  }, [formData.merchant, formData.notes, getCategorySuggestion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTransaction(editingId, formData);
        setEditingId(null);
      } else {
        await addTransaction(formData);
      }
      setFormData({
        amount: '',
        merchant: '',
        category: 'Food',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        isRecurring: false,
        recurrence: 'monthly'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      amount: transaction.amount,
      merchant: transaction.merchant || '',
      category: transaction.category,
      type: transaction.type,
      date: new Date(transaction.date).toISOString().split('T')[0],
      notes: transaction.notes || '',
      isRecurring: Boolean(transaction.isRecurring),
      recurrence: transaction.recurrence || 'monthly'
    });
    setEditingId(transaction._id);
    setShowForm(true);
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCsvError('');

    try {
      const content = await file.text();
      await importTransactions(content);
      fileInputRef.current.value = null;
    } catch (error) {
      console.error(error);
      setCsvError('Unable to import CSV. Please make sure it is formatted correctly.');
    }
  };

  const handleRuleSubmit = (e) => {
    e.preventDefault();
    if (!ruleForm.keyword || !ruleForm.category) return;
    addCategoryRule(ruleForm);
    setRuleForm({ keyword: '', category: 'Food' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">💳 Transactions</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Add entries, import CSV data, and keep recurring payments on schedule.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
          >
            Import CSV
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Hide Form' : 'Add Transaction'}
          </button>
          <button
            onClick={() => setShowRuleForm(!showRuleForm)}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Smart Category Rules
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
      {csvError && <div className="rounded-lg bg-red-100 text-red-700 p-4">{csvError}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Merchant</label>
                <input
                  type="text"
                  value={formData.merchant}
                  onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. Starbucks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows="2"
                placeholder="Add description..."
              />
            </div>
            {suggestedCategory && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-sm text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
                Suggested category: <strong>{suggestedCategory}</strong>{' '}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, category: suggestedCategory })}
                  className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300"
                >
                  Apply
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Recurring transaction
              </label>
              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recurrence</label>
                  <select
                    value={formData.recurrence}
                    onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Add'} Transaction
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    amount: '',
                    merchant: '',
                    category: 'Food',
                    type: 'expense',
                    date: new Date().toISOString().split('T')[0],
                    notes: '',
                    isRecurring: false,
                    recurrence: 'monthly'
                  });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showRuleForm && (
        <div className="bg-slate-900/90 rounded-3xl p-6 shadow border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Smart Category Rules</h2>
            <button
              type="button"
              onClick={() => setShowRuleForm(false)}
              className="text-slate-300 hover:text-white"
            >
              Close
            </button>
          </div>
          <form onSubmit={handleRuleSubmit} className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-200">Keyword</label>
              <input
                type="text"
                required
                value={ruleForm.keyword}
                onChange={(e) => setRuleForm({ ...ruleForm, keyword: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="e.g. Netflix"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">Category</label>
              <select
                value={ruleForm.category}
                onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="self-end rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-400"
            >
              Save Rule
            </button>
          </form>

          {categoryRules.length > 0 && (
            <div className="mt-6 space-y-3">
              {categoryRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-950/80 p-4 text-slate-200">
                  <div>
                    <p className="font-semibold">{rule.keyword}</p>
                    <p className="text-sm text-slate-400">Category: {rule.category}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCategoryRule(rule.id)}
                    className="rounded-full border border-slate-700 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Notes</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{transaction.notes}</td>
                  <td className={`px-6 py-4 text-sm font-semibold text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{user?.currency} {transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {recurringTemplates.length > 0 && (
        <div className="bg-slate-900/90 rounded-3xl p-6 shadow border border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Active Recurring Templates</h2>
            <p className="text-sm text-slate-400">Generated automatically based on recurring entries.</p>
          </div>
          <div className="grid gap-4">
            {recurringTemplates.map((template) => (
              <div key={template.id} className="rounded-3xl bg-slate-950/80 p-4 text-slate-200">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{template.merchant || template.category}</p>
                    <p className="text-sm text-slate-400">Next date: {new Date(template.nextDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">{template.recurrence}</span>
                    <button
                      type="button"
                      onClick={() => stopRecurringTemplate(template.id)}
                      className="rounded-full border border-red-500 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
