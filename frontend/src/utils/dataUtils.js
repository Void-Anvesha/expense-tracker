import { addMonths, addWeeks, addDays, format, parseISO, isAfter, startOfDay, subMonths } from 'date-fns';

export const STORAGE_KEYS = {
  transactions: 'moneyflow_transactions',
  budgets: 'moneyflow_budgets',
  goals: 'moneyflow_goals',
  categoryRules: 'moneyflow_category_rules',
  recurringTemplates: 'moneyflow_recurring_templates'
};

export const DEFAULT_CATEGORY_RULES = [
  { id: 'rule-merchant-coffee', keyword: 'coffee', category: 'Food' },
  { id: 'rule-merchant-uber', keyword: 'uber', category: 'Transport' },
  { id: 'rule-merchant-netflix', keyword: 'netflix', category: 'Entertainment' },
  { id: 'rule-merchant-spotify', keyword: 'spotify', category: 'Entertainment' },
  { id: 'rule-merchant-shell', keyword: 'shell', category: 'Utilities' },
  { id: 'rule-merchant-amazon', keyword: 'amazon', category: 'Shopping' },
  { id: 'rule-merchant-salary', keyword: 'salary', category: 'Salary' },
  { id: 'rule-merchant-payroll', keyword: 'payroll', category: 'Salary' }
];

export const loadStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Unable to load ${key} from localStorage`, error);
    return defaultValue;
  }
};

export const saveStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key} to localStorage`, error);
  }
};

export const generateId = () => `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const formatDate = (date) => format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM-dd');

export const getMonthKey = (date) => format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM');

export const getNextRecurrenceDate = (date, recurrence) => {
  if (!date) {
    date = new Date();
  }
  const normalized = typeof date === 'string' ? parseISO(date) : date;
  switch (recurrence) {
    case 'weekly':
      return addWeeks(normalized, 1);
    case 'biweekly':
      return addWeeks(normalized, 2);
    case 'daily':
      return addDays(normalized, 1);
    case 'monthly':
    default:
      return addMonths(normalized, 1);
  }
};

export const processRecurringTemplates = (templates, transactions, today = new Date()) => {
  const safeToday = startOfDay(today);
  let updatedTransactions = [...transactions];
  const updatedTemplates = templates.map((template) => {
    let nextDate = template.nextDate ? parseISO(template.nextDate) : startOfDay(template.startDate || new Date());

    while (!isAfter(startOfDay(nextDate), safeToday)) {
      const recurrenceTransaction = {
        _id: generateId(),
        amount: Number(template.amount),
        category: template.category,
        type: template.type,
        date: format(startOfDay(nextDate), 'yyyy-MM-dd'),
        notes: template.notes || '',
        merchant: template.merchant || '',
        isRecurring: true,
        recurringTemplateId: template.id
      };
      updatedTransactions = [recurrenceTransaction, ...updatedTransactions];
      nextDate = getNextRecurrenceDate(nextDate, template.recurrence);
    }

    return {
      ...template,
      nextDate: format(startOfDay(nextDate), 'yyyy-MM-dd')
    };
  });

  return { updatedTransactions, updatedTemplates };
};

const splitCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

export const parseCsvContent = (content) => {
  const rows = content
    .trim()
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (!rows.length) {
    return [];
  }

  const headers = splitCsvLine(rows[0]).map((header) => header.toLowerCase());
  return rows.slice(1).map((row) => {
    const values = splitCsvLine(row);
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index] !== undefined ? values[index] : '';
      return acc;
    }, {});
  });
};

export const inferTypeFromAmount = (amount) => {
  if (Number(amount) === 0) return 'expense';
  return Number(amount) >= 0 ? 'income' : 'expense';
};

export const suggestCategory = (merchant = '', notes = '', rules = DEFAULT_CATEGORY_RULES) => {
  const text = `${merchant || ''} ${notes || ''}`.toLowerCase();
  for (const rule of rules) {
    if (rule.keyword && text.includes(rule.keyword.toLowerCase())) {
      return rule.category;
    }
  }

  const defaultMatches = [
    { keyword: 'coffee', category: 'Food' },
    { keyword: 'uber', category: 'Transport' },
    { keyword: 'taxi', category: 'Transport' },
    { keyword: 'netflix', category: 'Entertainment' },
    { keyword: 'spotify', category: 'Entertainment' },
    { keyword: 'amazon', category: 'Shopping' },
    { keyword: 'shell', category: 'Utilities' },
    { keyword: 'salary', category: 'Salary' },
    { keyword: 'rent', category: 'Housing' }
  ];

  for (const match of defaultMatches) {
    if (text.includes(match.keyword)) {
      return match.category;
    }
  }

  return '';
};

export const computeMonthlySeries = (transactions, months = 6) => {
  const now = new Date();
  const series = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const monthDate = subMonths(now, i);
    const key = format(monthDate, 'yyyy-MM');
    const label = format(monthDate, 'MMM yyyy');
    const monthly = transactions.filter((transaction) => getMonthKey(transaction.date) === key);
    const income = monthly.filter((txn) => txn.type === 'income').reduce((sum, txn) => sum + Number(txn.amount), 0);
    const expenses = monthly.filter((txn) => txn.type === 'expense').reduce((sum, txn) => sum + Number(txn.amount), 0);
    const savings = income - expenses;

    series.push({ month: label, monthKey: key, income, expenses, savings, net: savings });
  }

  return series;
};

export const computeCategoryBreakdown = (transactions, monthKey) => {
  const filtered = transactions.filter((txn) => getMonthKey(txn.date) === monthKey && txn.type === 'expense');
  return filtered.reduce((acc, txn) => {
    const category = txn.category || 'Other';
    acc[category] = (acc[category] || 0) + Number(txn.amount);
    return acc;
  }, {});
};

export const computeBudgetStatus = (budgets, transactions, monthKey) => {
  return budgets.map((budget) => {
    const monthlyExpenses = transactions.filter(
      (txn) => txn.type === 'expense' && txn.category === budget.category && getMonthKey(txn.date) === monthKey
    );
    const spent = monthlyExpenses.reduce((sum, txn) => sum + Number(txn.amount), 0);
    const limit = Number(budget.limit) || 0;
    const percentageUsed = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const isExceeded = limit > 0 && spent > limit;
    const isAlertTriggered = limit > 0 && percentageUsed >= (Number(budget.alertThreshold) || 80);

    return {
      ...budget,
      spent,
      remaining: Number((limit - spent).toFixed(2)),
      percentageUsed,
      isExceeded,
      isAlertTriggered
    };
  });
};

export const forecastCashFlow = (monthlySeries, forecastMonths = 3) => {
  const lastThree = monthlySeries.slice(-3);
  const averageNet = lastThree.reduce((sum, row) => sum + Number(row.net), 0) / Math.max(lastThree.length, 1);

  const forecast = [];
  const lastMonth = monthlySeries[monthlySeries.length - 1];
  const baseDate = lastMonth ? parseISO(`${lastMonth.monthKey}-01`) : new Date();

  for (let i = 1; i <= forecastMonths; i += 1) {
    const forecastDate = addMonths(baseDate, i);
    forecast.push({
      month: format(forecastDate, 'MMM yyyy'),
      forecastNet: Number(averageNet.toFixed(2))
    });
  }

  return {
    averageNet: Number(averageNet.toFixed(2)),
    forecast
  };
};
