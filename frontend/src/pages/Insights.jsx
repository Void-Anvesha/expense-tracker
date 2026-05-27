import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, AlertTriangle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const COLORS = ['#8b5cf6', '#fb7185', '#38bdf8', '#f97316', '#22c55e', '#e879f9', '#38bdf8'];

export default function Insights() {
  const { user } = useAuth();
  const { loading, insights, monthlySeries, categoryBreakdown, forecast, budgetAlerts } = useData();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 p-10 text-slate-200 shadow-2xl shadow-slate-950/25">
        Loading insights…
      </div>
    );
  }

  const currentMonth = monthlySeries[monthlySeries.length - 1] || { income: 0, expenses: 0, savings: 0, net: 0 };
  const categoryData = Object.entries(categoryBreakdown).map(([name, value], index) => ({ name, value, color: COLORS[index % COLORS.length] }));

  return (
    <div className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Insights</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Smarter spending starts here</h1>
          </div>
          <div className="rounded-full bg-white/10 px-4 py-3 text-sm text-slate-200">Updated live</div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InsightCard title="Total Balance" value={`${user?.currency}${currentMonth.net.toFixed(2)}`} />
          <InsightCard title="This Month Income" value={`${user?.currency}${currentMonth.income.toFixed(2)}`} accent="from-emerald-500 to-sky-500" />
          <InsightCard title="This Month Expenses" value={`${user?.currency}${currentMonth.expenses.toFixed(2)}`} accent="from-rose-500 to-orange-500" />
        </div>
      </div>

      <section className="glass-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">6-Month cash flow</h2>
            <p className="mt-2 text-slate-400">Monthly income, expenses, and savings trends at a glance.</p>
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">Trend analysis</div>
        </div>
        <div className="mt-8 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: '#cbd5e1' }} />
              <YAxis tick={{ fill: '#cbd5e1' }} />
              <Tooltip formatter={(value) => `${user?.currency}${Number(value).toFixed(2)}`} contentStyle={{ background: '#0f172a', borderRadius: '1rem', borderColor: 'rgba(148,163,184,0.16)' }} itemStyle={{ color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#cbd5e1' }} />
              <Line type="monotone" dataKey="income" stroke="#38bdf8" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="expenses" stroke="#fb7185" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="savings" stroke="#22c55e" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Category comparison</h2>
            <p className="mt-2 text-slate-400">See which categories consume the most of your monthly budget.</p>
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">Current month</div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_0.6fr]">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={60} paddingAngle={4}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${user?.currency}${Number(value).toFixed(2)}`} contentStyle={{ background: '#0f172a', borderRadius: '1rem', borderColor: 'rgba(148,163,184,0.16)' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoryData.map((entry) => (
              <div key={entry.name} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{entry.name}</p>
                    <p className="text-sm text-slate-400">{user?.currency}{entry.value.toFixed(2)}</p>
                  </div>
                  <span className="inline-flex h-3 w-3 rounded-full" style={{ background: entry.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Cash flow forecast</h2>
            <p className="mt-2 text-slate-400">Projected net cash flow based on recent history.</p>
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">Next 3 months</div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Average monthly net</p>
            <p className="mt-4 text-3xl font-semibold text-white">{user?.currency}{forecast.averageNet.toFixed(2)}</p>
          </div>
          {forecast.forecast.map((item) => (
            <div key={item.month} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{item.month}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{user?.currency}{item.forecastNet.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      {budgetAlerts.length > 0 && (
        <section className="glass-card p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Budget alerts</h2>
              <p className="mt-2 text-slate-400">Notifications when categories are close to or over budget.</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-rose-400" />
          </div>
          <div className="mt-8 space-y-4">
            {budgetAlerts.map((budget) => (
              <div key={budget.id} className={`rounded-[1.75rem] border border-white/10 bg-white/5 p-5 ${budget.isExceeded ? 'border-rose-500/40' : 'border-amber-500/30'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{budget.category}</p>
                    <p className="mt-2 text-slate-400">Spent {user?.currency}{budget.spent.toFixed(2)} of {user?.currency}{budget.limit.toFixed(2)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${budget.isExceeded ? 'bg-rose-500/20 text-rose-200' : 'bg-amber-500/20 text-amber-200'}`}>
                    {budget.isExceeded ? 'Exceeded' : 'Alert'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {insights?.patterns && insights.patterns.length > 0 && (
        <section className="glass-card p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Recommendations</h2>
              <p className="mt-2 text-slate-400">Simple actions to improve your spending balance.</p>
            </div>
            <Sparkles className="h-8 w-8 text-fuchsia-400" />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {insights.recommendations.recommendations.map((rec, idx) => (
              <div key={idx} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="font-semibold text-white">{rec.category}</p>
                <p className="mt-2 text-slate-400">{rec.message}</p>
                <p className="mt-3 text-sm text-slate-500">Potential savings: {user?.currency}{rec.potentialSavings}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InsightCard({ title, value, accent = 'from-slate-500 to-slate-600' }) {
  return (
    <div className={`rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.18)]`}>
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <p className={`mt-4 text-3xl font-semibold text-white`}>{value}</p>
      <div className={`mt-4 h-2 rounded-full bg-gradient-to-r ${accent}`} />
    </div>
  );
}
