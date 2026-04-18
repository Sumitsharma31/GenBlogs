'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { Lock, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function AdminLogin() {
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to admin
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await login(secret);
      if (response.success) {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your secret.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-12">
          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
          
          <div className="relative">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                Admin Access
              </h2>
              <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Enter your administrative secret to continue
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="secret" className="block text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  Secret Key
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-indigo-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="secret"
                    name="secret"
                    type="password"
                    required
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-12 py-4 text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white dark:placeholder:text-neutral-600"
                    placeholder="••••••••••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !secret.trim()}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-black text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <span>Unlock Dashboard</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
                
                {/* Button Glow Effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform group-hover:translate-x-full duration-1000" />
              </button>
            </form>
            
            <div className="mt-10 flex items-center justify-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>GenBlog Platform Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
