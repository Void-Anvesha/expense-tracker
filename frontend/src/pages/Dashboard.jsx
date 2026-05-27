import React, { useEffect } from 'react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Clock3, Wallet, Star } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#8b5cf6', '#fb7185', '#38bdf8', '#f97316', '#22c55e', '#e879f9', '#38bdf8'];

export default function Dashboard() {
  const { user } = useAuth();
  const { insights, budgets, goals, fetchInsights, fetchBudgets, fetchGoals } = useData();

  useEffect(() => {
    fetchInsights();
    fetchBudgets();
    fetchGoals();
  }, []);

  if (!insights) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 p-10 text-slate-200 shadow-2xl shadow-slate-950/25">
        Loading your finance overview...
      </div>
    );
  }

  const { overview, patterns, recommendations } = insights;
  const activeGoals = goals.filter((goal) => goal.status === 'active');
  const topRecommendation = recommendations?.recommendations?.[0];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="glass-card p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Dashboard overview</p>
              <h2 className="mt-4 text-4xl font-semibold text-white">Welcome back, {user?.name || 'friend'}</h2>
            </div>
            <div className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100">Next expense review in 2 days</div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard icon={<Wallet className="h-5 w-5" />} label="Balance" value={overview?.totalBalance} currency={user?.currency} accent="from-cyan-500 to-sky-500" />
            <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="Income" value={overview?.currentMonthIncome} currency={user?.currency} accent="from-emerald-500 to-lime-500" />
            <KpiCard icon={<Clock3 className="h-5 w-5" />} label="Expenses" value={overview?.currentMonthExpenses} currency={user?.currency} accent="from-rose-500 to-orange-500" />
            <KpiCard icon={<Star className="h-5 w-5" />} label="Savings Rate" value={overview?.savingsRate} suffix="%" accent="from-violet-500 to-fuchsia-500" />
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-semibold text-white">Budget summary</h3>
          <p className="mt-3 text-slate-400">Track budgets and get alerts for categories nearing the limit.</p>
          <div className="mt-8 space-y-4">
            {budgets.slice(0, 3).map((budget) => (
              <div key={budget._id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{budget.category}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{user?.currency} {budget.spent?.toFixed(2)} / {user?.currency} {budget.limit?.toFixed(2)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${budget.percentageUsed >= 100 ? 'bg-rose-500/20 text-rose-200' : budget.percentageUsed >= 80 ? 'bg-amber-500/20 text-amber-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
                    {budget.percentageUsed}%
                  </span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-3 rounded-full ${budget.percentageUsed >= 100 ? 'bg-rose-500' : budget.percentageUsed >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-card p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Spending by category</h3>
              <p className="mt-2 text-slate-400">A quick breakdown of your spending habits.</p>
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">Live update</div>
          </div>
          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={Array.isArray(overview?.categoryBreakdown) ? overview.categoryBreakdown : []} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={3}>
                  {Array.isArray(overview?.categoryBreakdown) && overview.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${user?.currency}${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <div>
            <h3 className="text-xl font-semibold text-white">Active goals</h3>
            <p className="mt-2 text-slate-400">Where you are putting your savings to work.</p>
          </div>
          <div className="mt-8 space-y-5">
            {activeGoals.slice(0, 3).map((goal) => (
              <div key={goal._id} className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{goal.name}</p>
                    <p className="text-sm text-slate-400">{goal.category}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">{goal.progressPercentage}%</span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-white/10">
                  <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {patterns && patterns.length > 0 && (
          <div className="glass-card p-8">
            <h3 className="text-xl font-semibold text-white">Overspending alerts</h3>
            <p className="mt-2 text-slate-400">Take action before budgets overflow.</p>
            <div className="mt-8 space-y-4">
              {patterns.slice(0, 3).map((pattern, index) => (
                <div key={index} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{pattern.category}</p>
                      <p className="mt-1 text-sm text-slate-400">{pattern.message}</p>
                    </div>
                    <span className="text-sm font-semibold text-rose-200">Alert</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {topRecommendation && (
          <div className="glass-card p-8">
            <h3 className="text-xl font-semibold text-white">Savings opportunities</h3>
            <p className="mt-2 text-slate-400">Potential adjustments to save more every month.</p>
            <div className="mt-8 space-y-4">
              {recommendations?.recommendations?.slice(0, 3).map((item, idx) => (
                <div key={idx} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{item.category}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-300">{user?.currency}{item.potentialSavings}</p>
                      <p className="text-xs text-slate-500">monthly</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, currency, suffix, accent }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.18)]">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br ${accent} text-white shadow-lg shadow-slate-950/20`}>
        {icon}
      </div>
      <p className="mt-5 text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{currency}{value?.toFixed(2)}{suffix}</p>
    </div>
  );
}
