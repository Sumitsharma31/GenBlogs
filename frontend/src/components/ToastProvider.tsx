'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
};

type ToastContextValue = {
  toast: (t: Omit<Toast, 'id'> & { durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function iconFor(type: ToastType) {
  switch (type) {
    case 'success':
      return CheckCircle2;
    case 'error':
      return XCircle;
    default:
      return Info;
  }
}

function ringFor(type: ToastType) {
  switch (type) {
    case 'success':
      return 'ring-green-500/20 border-green-200 bg-green-50 text-green-900 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-100';
    case 'error':
      return 'ring-red-500/20 border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-100';
    default:
      return 'ring-indigo-500/20 border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-100';
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current[id];
    if (timer) window.clearTimeout(timer);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    ({ durationMs = 3500, ...t }: Omit<Toast, 'id'> & { durationMs?: number }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((prev) => [{ id, ...t }, ...prev].slice(0, 4));
      timers.current[id] = window.setTimeout(() => remove(id), durationMs);
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Top-right corner toast stack */}
      <div className="fixed right-4 top-4 z-[100] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((t) => {
          const Icon = iconFor(t.type);
          return (
            <div
              key={t.id}
              className={[
                'pointer-events-auto rounded-2xl border p-4 shadow-2xl shadow-black/10 ring-1 backdrop-blur',
                ringFor(t.type),
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className="h-5 w-5 opacity-90" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-extrabold">{t.title}</p>
                    <button
                      type="button"
                      onClick={() => remove(t.id)}
                      className="rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100"
                      aria-label="Dismiss notification"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {t.description ? (
                    <p className="mt-1 text-sm opacity-80">{t.description}</p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider />');
  }
  return ctx;
}

