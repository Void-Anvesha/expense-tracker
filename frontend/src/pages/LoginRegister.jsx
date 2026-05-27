import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedEmail = formData.email.trim().toLowerCase();

    try {
      if (isLogin) {
        await login(normalizedEmail, formData.password);
      } else {
        if (!formData.name) {
          setError('Please enter your name to continue.');
          setLoading(false);
          return;
        }
        await register(formData.name, normalizedEmail, formData.password);
      }
      navigate('/app');
    } catch (err) {
        const respErr = err.response?.data;
        const message =
          (respErr && (respErr.error || respErr.message)) ||
          err.message ||
          'Unable to authenticate. Please check your credentials and try again.';
        setError(typeof message === 'object' ? JSON.stringify(message) : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.18),transparent_20%),linear-gradient(135deg,#090b1f_0%,#3c1053_50%,#db2777_100%)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30">
              <ShieldCheck className="h-4 w-4" />
              Secure finance made simple
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{isLogin ? 'Sign in to MoneyFlow' : 'Create your finance account'}</h1>
            <p className="mt-4 max-w-xl text-slate-300">Track budgets, expenses, and savings goals with a beautiful dashboard built just for your money.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 text-center text-slate-300 shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Powerful onboarding</p>
            <p className="mt-4 text-3xl font-semibold text-white">Fast. Secure. Insightful.</p>
            <Sparkles className="mx-auto mt-4 h-10 w-10 text-fuchsia-400" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-glass"
                placeholder="Jane Doe"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-glass"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-glass"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

          <button type="submit" className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-slate-400">
            {isLogin ? 'New to MoneyFlow?' : 'Already registered?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-semibold text-white hover:text-fuchsia-300"
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
