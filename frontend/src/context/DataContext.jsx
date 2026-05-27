import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { startOfDay } from 'date-fns';
import {
  STORAGE_KEYS,
  DEFAULT_CATEGORY_RULES,
  loadStorage,
  saveStorage,
  generateId,
  formatDate,
  getMonthKey,
  suggestCategory,
  parseCsvContent,
  inferTypeFromAmount,
  getNextRecurrenceDate,
  processRecurringTemplates,
  computeMonthlySeries,
  computeCategoryBreakdown,
  computeBudgetStatus,
  forecastCashFlow
} from '../utils/dataUtils';

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [recurringTemplates, setRecurringTemplates] = useState([]);
  const [categoryRules, setCategoryRules] = useState(DEFAULT_CATEGORY_RULES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTransactions = loadStorage(STORAGE_KEYS.transactions, []);
    const storedBudgets = loadStorage(STORAGE_KEYS.budgets, []);
    const storedGoals = loadStorage(STORAGE_KEYS.goals, []);
    const storedRules = loadStorage(STORAGE_KEYS.categoryRules, DEFAULT_CATEGORY_RULES);
    const storedRecurringTemplates = loadStorage(STORAGE_KEYS.recurringTemplates, []);

    const { updatedTransactions, updatedTemplates } = processRecurringTemplates(
      storedRecurringTemplates,
      storedTransactions,
      new Date()
    );

    setTransactions(updatedTransactions);
    setBudgets(storedBudgets);
    // compute derived fields for goals (progress, days remaining, status)
    const computedGoals = storedGoals.map((g) => {
      const target = Number(g.targetAmount) || 0;
      const current = Number(g.currentAmount) || 0;
      const progress = target > 0 ? Math.round((current / target) * 100) : 0;
      const deadlineDate = g.deadline ? new Date(g.deadline) : null;
      const today = startOfDay(new Date());
      const daysRemaining = deadlineDate ? Math.max(0, Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))) : null;
      const status = current >= target && target > 0 ? 'completed' : 'active';
      return { ...g, progressPercentage: progress, daysRemaining, status };
    });
    setGoals(computedGoals);
    setRecurringTemplates(updatedTemplates);
    setCategoryRules(storedRules);

    saveStorage(STORAGE_KEYS.transactions, updatedTransactions);
    saveStorage(STORAGE_KEYS.recurringTemplates, updatedTemplates);
    setLoading(false);
  }, []);

  const saveTransactions = useCallback((items) => {
    setTransactions(items);
    saveStorage(STORAGE_KEYS.transactions, items);
  }, []);

  const saveBudgets = useCallback((items) => {
    setBudgets(items);
    saveStorage(STORAGE_KEYS.budgets, items);
  }, []);

  const saveGoals = useCallback((items) => {
    setGoals(items);
    saveStorage(STORAGE_KEYS.goals, items);
  }, []);

  const saveCategoryRules = useCallback((items) => {
    setCategoryRules(items);
    saveStorage(STORAGE_KEYS.categoryRules, items);
  }, []);

  const saveRecurringTemplates = useCallback((items) => {
    setRecurringTemplates(items);
    saveStorage(STORAGE_KEYS.recurringTemplates, items);
  }, []);

  const fetchTransactions = useCallback(async (filters = {}) => {
    let result = [...transactions];
    if (filters.category) {
      result = result.filter((txn) => txn.category === filters.category);
    }
    if (filters.type) {
      result = result.filter((txn) => txn.type === filters.type);
    }
    return result;
  }, [transactions]);

  const addRecurringTemplate = useCallback(
    (templateData) => {
      const template = {
        ...templateData,
        id: generateId(),
        recurrence: templateData.recurrence || 'monthly',
        nextDate: templateData.nextDate
          ? formatDate(templateData.nextDate)
          : formatDate(getNextRecurrenceDate(templateData.date || new Date(), templateData.recurrence || 'monthly'))
      };
      const updated = [template, ...recurringTemplates];
      saveRecurringTemplates(updated);
      return template;
    },
    [recurringTemplates, saveRecurringTemplates]
  );

  const addTransaction = useCallback(
    async (transactionData) => {
      const category =
        transactionData.category ||
        suggestCategory(transactionData.merchant, transactionData.notes, categoryRules) ||
        'Other';
      const amount = Number(transactionData.amount) || 0;
      const type = transactionData.type || inferTypeFromAmount(amount);
      const newTransaction = {
        _id: generateId(),
        amount: Math.abs(amount),
        category,
        type,
        date: formatDate(transactionData.date || new Date()),
        notes: transactionData.notes || '',
        merchant: transactionData.merchant || '',
        createdAt: new Date().toISOString()
      };

      saveTransactions([newTransaction, ...transactions]);

      if (transactionData.isRecurring) {
        addRecurringTemplate({
          amount: Math.abs(amount),
          category,
          type,
          date: newTransaction.date,
          notes: transactionData.notes || '',
          merchant: transactionData.merchant || '',
          recurrence: transactionData.recurrence || 'monthly',
          startDate: newTransaction.date
        });
      }

      return newTransaction;
    },
    [transactions, categoryRules, addRecurringTemplate, saveTransactions]
  );

  const updateTransaction = useCallback(
    async (id, transactionData) => {
      const updated = transactions.map((txn) =>
        txn._id === id
          ? {
              ...txn,
              ...transactionData,
              amount: Number(transactionData.amount) || txn.amount,
              category: transactionData.category || txn.category,
              type: transactionData.type || txn.type,
              date: formatDate(transactionData.date || txn.date)
            }
          : txn
      );
      saveTransactions(updated);
      return updated.find((txn) => txn._id === id);
    },
    [transactions, saveTransactions]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      const updated = transactions.filter((txn) => txn._id !== id);
      saveTransactions(updated);
    },
    [transactions, saveTransactions]
  );

  const importTransactions = useCallback(
    async (fileContent) => {
      try {
        const rows = parseCsvContent(fileContent);
        const imported = rows.map((row) => {
          const amount = Number(row.amount || row.Amount || row.amt || 0);
          const type = row.type || row.Type || inferTypeFromAmount(amount);
          const category = row.category || row.Category || suggestCategory(row.merchant || row.Merchant || '', row.notes || row.Notes || '', categoryRules) || 'Other';
          return {
            _id: generateId(),
            amount: Math.abs(amount),
            category,
            type: type.toLowerCase(),
            date: formatDate(row.date || row.Date || new Date()),
            notes: row.notes || row.Notes || '',
            merchant: row.merchant || row.Merchant || '',
            createdAt: new Date().toISOString()
          };
        });
        saveTransactions([...imported, ...transactions]);
        return imported;
      } catch (error) {
        console.error('Failed to import transactions:', error);
        throw error;
      }
    },
    [transactions, categoryRules, saveTransactions]
  );

  const fetchBudgets = useCallback(async () => {
    return budgets;
  }, [budgets]);

  const setBudgetLimit = useCallback(
    async (budgetData) => {
      const existing = budgets.filter((b) => b.category !== budgetData.category);
      const record = {
        id: generateId(),
        category: budgetData.category,
        limit: Number(budgetData.limit) || 0,
        alertThreshold: Number(budgetData.alertThreshold) || 80
      };
      const updated = [record, ...existing];
      saveBudgets(updated);
      return record;
    },
    [budgets, saveBudgets]
  );

  const deleteBudget = useCallback(
    async (id) => {
      const updated = budgets.filter((b) => b.id !== id);
      saveBudgets(updated);
    },
    [budgets, saveBudgets]
  );

  const fetchGoals = useCallback(async () => {
    return goals;
  }, [goals]);

  const addGoal = useCallback(
    async (goalData) => {
      const goal = {
        _id: generateId(),
        ...goalData,
        createdAt: new Date().toISOString()
      };
      const target = Number(goal.targetAmount) || 0;
      const current = Number(goal.currentAmount) || 0;
      const progress = target > 0 ? Math.round((current / target) * 100) : 0;
      const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
      const today = startOfDay(new Date());
      const daysRemaining = deadlineDate ? Math.max(0, Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))) : null;
      const status = current >= target && target > 0 ? 'completed' : 'active';
      const goalWithComputed = { ...goal, progressPercentage: progress, daysRemaining, status };
      const updated = [goalWithComputed, ...goals];
      saveGoals(updated);
      return goalWithComputed;
    },
    [goals, saveGoals]
  );

  const updateGoal = useCallback(
    async (id, goalData) => {
      const updated = goals.map((goal) =>
        goal._id === id
          ? (() => {
              const merged = { ...goal, ...goalData };
              const target = Number(merged.targetAmount) || 0;
              const current = Number(merged.currentAmount) || 0;
              const progress = target > 0 ? Math.round((current / target) * 100) : 0;
              const deadlineDate = merged.deadline ? new Date(merged.deadline) : null;
              const today = startOfDay(new Date());
              const daysRemaining = deadlineDate ? Math.max(0, Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))) : null;
              const status = current >= target && target > 0 ? 'completed' : 'active';
              return { ...merged, progressPercentage: progress, daysRemaining, status };
            })()
          : goal
      );
      saveGoals(updated);
      return updated.find((goal) => goal._id === id);
    },
    [goals, saveGoals]
  );

  const deleteGoal = useCallback(
    async (id) => {
      const updated = goals.filter((goal) => goal._id !== id);
      saveGoals(updated);
    },
    [goals, saveGoals]
  );

  const addCategoryRule = useCallback(
    (ruleData) => {
      const rule = {
        id: generateId(),
        keyword: ruleData.keyword,
        category: ruleData.category
      };
      const updated = [rule, ...categoryRules];
      saveCategoryRules(updated);
      return rule;
    },
    [categoryRules, saveCategoryRules]
  );

  const deleteCategoryRule = useCallback(
    (id) => {
      const updated = categoryRules.filter((rule) => rule.id !== id);
      saveCategoryRules(updated);
    },
    [categoryRules, saveCategoryRules]
  );

  const stopRecurringTemplate = useCallback(
    (id) => {
      const updated = recurringTemplates.filter((template) => template.id !== id);
      saveRecurringTemplates(updated);
    },
    [recurringTemplates, saveRecurringTemplates]
  );

  const monthlySeries = useMemo(() => computeMonthlySeries(transactions, 6), [transactions]);
  const currentMonthKey = useMemo(() => (monthlySeries.length ? monthlySeries[monthlySeries.length - 1].monthKey : getMonthKey(new Date())), [monthlySeries]);
  const categoryBreakdown = useMemo(() => computeCategoryBreakdown(transactions, currentMonthKey), [transactions, currentMonthKey]);
  const budgetAlerts = useMemo(() => computeBudgetStatus(budgets, transactions, currentMonthKey), [budgets, transactions, currentMonthKey]);
  const forecast = useMemo(() => forecastCashFlow(monthlySeries, 3), [monthlySeries]);

  const insights = useMemo(() => {
    const current = monthlySeries[monthlySeries.length - 1] || { income: 0, expenses: 0, savings: 0, net: 0 };
    const overview = {
      totalBalance: current.net,
      currentMonthIncome: current.income,
      currentMonthExpenses: current.expenses,
      savingsRate: current.income ? Math.round((current.net / current.income) * 100) : 0,
      categoryBreakdown
    };
    const patterns = budgetAlerts.filter((item) => item.isAlertTriggered).map((item) => ({ category: item.category, message: item.isExceeded ? 'Budget exceeded' : 'Approaching limit' }));
    const recommendations = {
      recommendations: [
        {
          category: patterns.length ? patterns[0].category : 'Overall spending',
          message: patterns.length
            ? 'Review categories that are nearing or exceeding their budgets.'
            : 'Keep your spending aligned with your budget targets.',
          potentialSavings: patterns.length ? Math.round(current.expenses * 0.1) : Math.round(current.expenses * 0.05)
        }
      ]
    };

    return { overview, patterns, recommendations };
  }, [monthlySeries, categoryBreakdown, budgetAlerts]);

  const getCategorySuggestion = useCallback(
    (merchant, notes) => suggestCategory(merchant, notes, categoryRules),
    [categoryRules]
  );

  const fetchInsights = useCallback(async () => insights, [insights]);

  return (
    <DataContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        recurringTemplates,
        categoryRules,
        loading,
        insights,
        monthlySeries,
        categoryBreakdown,
        budgetAlerts,
        forecast,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        importTransactions,
        fetchBudgets,
        setBudgetLimit,
        deleteBudget,
        deleteFromBudget: deleteBudget,
        fetchGoals,
        addGoal,
        updateGoal,
        deleteGoal,
        addCategoryRule,
        deleteCategoryRule,
        getCategorySuggestion,
        addRecurringTemplate,
        stopRecurringTemplate,
        fetchInsights
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
