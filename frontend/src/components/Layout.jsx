import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, LogOut, Menu, X, CreditCard, Target, PieChart, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Layout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: BarChart3 },
    { name: 'Transactions', path: '/app/transactions', icon: CreditCard },
    { name: 'Budgets', path: '/app/budgets', icon: PieChart },
    { name: 'Goals', path: '/app/goals', icon: Target },
    { name: 'Insights', path: '/app/insights', icon: Activity }
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <aside className="hidden lg:flex lg:w-80 xl:w-96 flex-col border-r border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="flex flex-col gap-3 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 text-white shadow-[0_16px_40px_rgba(251,113,133,0.25)]">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">MoneyFlow</p>
              <h1 className="text-2xl font-semibold text-white">Finance Dashboard</h1>
            </div>
          </div>

          <nav className="flex flex-col gap-2 mt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 rounded-3xl px-5 py-4 transition ${
                      isActive
                        ? 'bg-gradient-to-r from-fuchsia-600 via-violet-600 to-sky-600 text-white shadow-lg shadow-fuchsia-500/20'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
            <p className="text-sm text-slate-400">Logged in as</p>
            <p className="mt-2 font-semibold text-white truncate">{user?.name || 'Finance User'}</p>
            <p className="text-sm text-slate-400 truncate">{user?.email || 'No email available'}</p>
            <button
              onClick={handleLogout}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-pink-500 via-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:scale-[1.01]"
            >
              <span className="inline-flex items-center gap-2 justify-center">
                <LogOut className="h-4 w-4" />
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-lg font-semibold text-white">MoneyFlow</div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Sign Out
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 xl:p-10">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex h-full w-72 flex-col border-r border-white/10 bg-slate-950/95 p-6 backdrop-blur-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="self-end rounded-2xl bg-white/10 p-3 text-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mt-6 space-y-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-3xl px-4 py-3 transition ${
                        isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
