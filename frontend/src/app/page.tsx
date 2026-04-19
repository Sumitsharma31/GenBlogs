'use client';

import React, { useEffect, useState } from 'react';
import { getBlogs, searchBlogs, subscribeNewsletter } from '@/lib/api';
import { Blog, PaginatedResponse } from '@/types';
import BlogGrid from '@/components/BlogGrid';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { Sparkles, TrendingUp, Search, BookOpen } from 'lucide-react';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching blogs from:', process.env.NEXT_PUBLIC_API_URL);
        const response: PaginatedResponse<Blog> = debouncedQuery
          ? await searchBlogs(debouncedQuery, 1, 12)
          : await getBlogs(1, 12);
        if (response.success) {
          setBlogs(response.data);
        } else {
          setError('Failed to load blogs');
        }
      } catch (err: any) {
        console.error('Fetch blogs error:', err);
        setError(`Connection to backend failed (${err.message}). API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
        setDiagnostic({
          url: process.env.NEXT_PUBLIC_API_URL,
          error: err.message,
          stack: err.stack,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [debouncedQuery]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(query.trim());
  };

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    try {
      setSubscribing(true);
      setSubscribeMessage(null);
      const res = await subscribeNewsletter(value);
      if (res?.success) {
        setSubscribeMessage(res.message || 'Subscribed successfully.');
        setEmail('');
      } else {
        setSubscribeMessage(res?.message || 'Failed to subscribe. Please try again.');
      }
    } catch (err: any) {
      setSubscribeMessage(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="flex flex-col gap-16 py-12 sm:py-20">

      {/* Hero Section */}
      <section className="container px-4 text-center">


        {/* Search */}
        <form
          onSubmit={onSearchSubmit}
          className="mx-auto flex max-w-xl items-center rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none"
        >
          <div className="flex flex-1 items-center px-4 text-neutral-400">
            <Search className="h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles (title, tags, topic)..."
              className="w-full bg-transparent px-3 py-2 text-sm text-neutral-900 focus:outline-none dark:text-white sm:text-base"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:px-8 sm:py-3 sm:text-base"
          >
            Search
          </button>
        </form>
      </section>

      {/* Featured Section */}
      <section className="container px-2">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">Latest Articles</h2>
          </div>
          <div className="hidden h-px flex-1 bg-neutral-200 dark:bg-neutral-800 mx-8 sm:block"></div>
          <button className="text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400">
            View all
          </button>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-12 text-center text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
            <p className="text-lg font-bold">{error}</p>
            <p className="mt-2 opacity-70">Check backend logs for more details.</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-20 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-xl font-bold text-neutral-500">No blog posts found yet.</p>
            <p className="mt-2 text-neutral-400">Waiting for the AI to generate some magic...</p>
          </div>
        ) : (
          <BlogGrid blogs={blogs} />
        )}
      </section>

      {/* Newsletter Section */}
      <section className="container px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 px-8 py-16 text-center text-white sm:px-20">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

          <h2 className="relative mb-4 text-3xl font-extrabold sm:text-4xl">Never miss a trend</h2>
          <p className="relative mx-auto mb-10 max-w-lg text-indigo-100/90 text-lg">
            Subscribe to our newsletter and get the latest AI-generated insights delivered directly to your inbox.
          </p>
          <form onSubmit={onSubscribe} className="relative mx-auto max-w-md">
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-2xl bg-white/10 border border-white/20 px-6 py-4 text-white placeholder:text-indigo-100/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={subscribing}
                required
              />
              <button
                type="submit"
                disabled={subscribing || !email.trim()}
                className="rounded-2xl bg-white px-8 py-4 font-bold text-indigo-600 transition-transform active:scale-95 disabled:opacity-60"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {subscribeMessage && (
              <p className="mt-4 text-sm font-bold text-white/90">{subscribeMessage}</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
