import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Budgets() {
  const { user } = useAuth();
  const { budgets, budgetAlerts, fetchBudgets, setBudgetLimit, deleteFromBudget } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Food',
    limit: '',
    alertThreshold: 80
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Education', 'Other'];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setBudgetLimit(formData);
      setFormData({ category: 'Food', limit: '', alertThreshold: 80 });
      setShowForm(false);
      await fetchBudgets();
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this budget?')) {
      // Implement delete if API supports it
      await fetchBudgets();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">💰 Budgets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Set Budget
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Limit</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: parseFloat(e.target.value) })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alert Threshold (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.alertThreshold}
                  onChange={(e) => setFormData({ ...formData, alertThreshold: parseInt(e.target.value) })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Set Budget
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(budgetAlerts && budgetAlerts.length ? budgetAlerts : budgets).map(budget => (
          <div key={budget.id || budget._id} className={`rounded-lg p-6 shadow ${
            budget.isAlertTriggered ? 'bg-red-50 dark:bg-red-900' : 'bg-white dark:bg-gray-800'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.currency} {Number(budget.spent || 0).toFixed(2)} / {user?.currency} {Number(budget.limit || 0).toFixed(2)}
                </p>
              </div>
              {budget.isAlertTriggered && (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${
                    budget.percentageUsed >= 100 ? 'bg-red-600' : 
                    budget.percentageUsed >= 80 ? 'bg-yellow-600' : 
                    'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Used: {Number(budget.percentageUsed || 0)}%</span>
                <span className={Number(budget.remaining || 0) > 0 ? 'text-green-600' : 'text-red-600'}>
                  Remaining: {user?.currency} {Number(budget.remaining || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Status */}
            {budget.isExceeded && (
              <div className="p-3 bg-red-200 dark:bg-red-800 rounded text-red-800 dark:text-red-200 text-sm">
                ❌ Budget exceeded! You're over by {user?.currency} {(budget.spent - budget.limit).toFixed(2)}
              </div>
            )}
            {budget.isAlertTriggered && !budget.isExceeded && (
              <div className="p-3 bg-yellow-200 dark:bg-yellow-800 rounded text-yellow-800 dark:text-yellow-200 text-sm">
                ⚠️ You've used {budget.percentageUsed}% of your budget
              </div>
            )}
          </div>
        ))}
      </div>

      {budgets.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No budgets set yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
