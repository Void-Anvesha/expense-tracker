import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Target } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Goals() {
  const { user } = useAuth();
  const { goals, fetchGoals, addGoal, updateGoal, deleteGoal } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Emergency Fund',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Normalize and validate form data
      const payload = { ...formData };
      // Ensure numeric values
      payload.targetAmount = Number(payload.targetAmount) || 0;
      payload.currentAmount = Number(payload.currentAmount) || 0;

      // Normalize date formats like DD-MM-YYYY -> YYYY-MM-DD for input[type=date]
      if (payload.deadline && /^\d{2}-\d{2}-\d{4}$/.test(payload.deadline)) {
        const [dd, mm, yyyy] = payload.deadline.split('-');
        payload.deadline = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      }

      // Basic validation
      if (!payload.name || !payload.targetAmount || !payload.deadline) {
        alert('Please provide name, target amount, and a valid deadline.');
        return;
      }

      if (editingId) {
        await updateGoal(editingId, payload);
        setEditingId(null);
      } else {
        await addGoal(payload);
      }
      setFormData({
        name: '',
        description: '',
        category: 'Emergency Fund',
        targetAmount: '',
        currentAmount: 0,
        deadline: '',
        priority: 'medium'
      });
      setShowForm(false);
      await fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id);
      await fetchGoals();
    }
  };

  const handleEdit = (goal) => {
    setFormData({
      name: goal.name,
      description: goal.description || '',
      category: goal.category,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: new Date(goal.deadline).toISOString().split('T')[0],
      priority: goal.priority
    });
    setEditingId(goal._id);
    setShowForm(true);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🎯 Financial Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option>Emergency Fund</option>
                  <option>Vacation</option>
                  <option>Investment</option>
                  <option>Education</option>
                  <option>Home</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: parseFloat(e.target.value) })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                rows="2"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Create'} Goal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    description: '',
                    category: 'Emergency Fund',
                    targetAmount: '',
                    currentAmount: 0,
                    deadline: '',
                    priority: 'medium'
                  });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map(goal => (
              <GoalCard
                key={goal._id}
                goal={goal}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">✅ Completed Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedGoals.map(goal => (
              <GoalCard
                key={goal._id}
                goal={goal}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                completed
              />
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow">
          <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">No goals yet. Set one to start your journey!</p>
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, user, onEdit, onDelete, completed }) {
  return (
    <div className={`rounded-lg p-6 shadow ${
      completed ? 'bg-green-50 dark:bg-green-900' : 'bg-white dark:bg-gray-800'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{goal.category}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(goal)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal._id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.currency} {goal.currentAmount?.toFixed(2)} / {user?.currency} {goal.targetAmount?.toFixed(2)}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{goal.progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
        <p>Days left: {goal.daysRemaining} days</p>
        <p>Priority: <span className={`font-medium ${
          goal.priority === 'high' ? 'text-red-600' : 
          goal.priority === 'medium' ? 'text-yellow-600' : 
          'text-green-600'
        }`}>{goal.priority}</span></p>
      </div>
    </div>
  );
}
