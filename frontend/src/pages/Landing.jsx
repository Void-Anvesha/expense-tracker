import React from 'react';
import HeroSection from '../components/HeroSection';
import { Sparkles, ShieldCheck, TrendingUp, PieChart } from 'lucide-react';

const features = [
  { title: 'Smart Budget Planner', description: 'Set category budgets and watch your spending stay on track.', icon: TrendingUp },
  { title: 'Instant Expense Tracking', description: 'Log income and expenses in seconds and stay updated in real time.', icon: PieChart },
  { title: 'Goal-Based Savings', description: 'Create goals and monitor progress with clear visual targets.', icon: ShieldCheck },
  { title: 'Insightful Analytics', description: 'Get spending trends, alerts, and savings recommendations.', icon: Sparkles }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.2),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.18),transparent_18%),linear-gradient(135deg,#090a1b_0%,#3c1053_50%,#db2777_100%)] text-slate-100 overflow-hidden">
      <HeroSection />
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="glass-card border border-white/10 p-6 backdrop-blur-xl shadow-[0_48px_80px_rgba(15,23,42,0.15)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-sky-500 text-white shadow-lg shadow-fuchsia-500/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-slate-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
