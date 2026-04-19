'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* Animated 404 Text */}
      <div className="relative mb-8">
        <h1 className="animate-float text-[12rem] font-black leading-none text-neutral-100 dark:text-neutral-900 sm:text-[16rem]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
            Oops! Page not found
          </p>
        </div>
      </div>

      {/* Message */}
      <div className="animate-fadeIn delay-100 max-w-md opacity-0">
        <p className="mb-10 text-lg text-neutral-600 dark:text-neutral-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      {/* Actions */}
      <div className="animate-fadeIn delay-200 flex flex-wrap justify-center gap-4 opacity-0">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/20"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-8 py-4 font-bold text-neutral-900 transition-all hover:scale-105 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Go Back
        </button>
      </div>

      {/* Decorative Circles */}
      <div className="fixed -z-10 overflow-hidden opacity-20 blur-3xl">
        <div className="absolute top-[-10%] left-[-10%] h-[40rem] w-[40rem] rounded-full bg-indigo-500/30" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-violet-500/30" />
      </div>
    </div>
  );
}
