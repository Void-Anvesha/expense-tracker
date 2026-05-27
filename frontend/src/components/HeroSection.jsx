import React from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, PiggyBank, Sparkles } from 'lucide-react';

const metrics = [
  { title: 'Monthly Savings', value: '₹ 24,850', icon: PiggyBank, accent: 'from-fuchsia-500 to-orange-400' },
  { title: 'Expense Control', value: '84% on track', icon: ShieldCheck, accent: 'from-sky-500 to-violet-500' },
  { title: 'Goal Progress', value: '3 active goals', icon: TrendingUp, accent: 'from-emerald-500 to-sky-500' },
  { title: 'Budget Insights', value: '12 alerts saved', icon: Sparkles, accent: 'from-pink-500 to-fuchsia-500' }
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.24),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),transparent_22%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,115,22,0.16)_0%,rgba(168,85,247,0.12)_42%,rgba(14,165,233,0.14)_100%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-[0_20px_80px_rgba(15,23,42,0.30)]">
              <ShieldCheck className="h-4 w-4 text-fuchsia-300" />
              Secure finance tracking for every goal
            </span>

            <div className="space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Master your money with a clean, powerful personal finance dashboard.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                MoneyFlow brings budgets, transactions, goals, and insights together in one elegant app. Track spending, manage budgets, and reach your financial milestones with a premium experience.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="/login" className="btn-primary inline-flex items-center justify-center gap-3">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/app" className="btn-secondary inline-flex items-center justify-center gap-3">
                View Dashboard
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {metrics.map((metric) => (
                <div key={metric.title} className="glass-card border border-white/10 p-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${metric.accent} text-white shadow-lg shadow-slate-900/25`}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-sm uppercase tracking-[0.24em] text-slate-400">{metric.title}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="absolute left-0 top-20 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between text-slate-300">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em]">Total balance</p>
                  <p className="mt-3 text-4xl font-semibold text-white">₹ 152,450</p>
                </div>
                <span className="rounded-3xl bg-white/10 px-4 py-2 text-sm text-white/80">+12.4%</span>
              </div>

              <div className="space-y-4 rounded-[2rem] bg-white/5 p-6">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Income</span>
                  <span className="font-semibold text-emerald-300">₹ 68,300</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Expenses</span>
                  <span className="font-semibold text-rose-300">₹ 33,870</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Savings</span>
                  <span className="font-semibold text-sky-300">₹ 18,230</span>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Active goals</span>
                  <span className="text-sm font-semibold text-white">3 goals</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                      <span>Vacation Fund</span>
                      <span>72%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                      <span>Emergency Savings</span>
                      <span>43%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
