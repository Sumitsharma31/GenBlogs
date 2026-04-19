'use client';

import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogBySlug } from '@/lib/api';
import { Blog } from '@/types';
import BlogContent from '@/components/BlogContent';
import FAQSection from '@/components/FAQSection';
import { useToast } from '@/components/ToastProvider';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  ChevronRight,
  User,
  ExternalLink
} from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          type: 'success',
          title: 'Link copied!',
          description: 'The blog link has been copied to your clipboard.',
        });
      } catch (err) {
        toast({
          type: 'error',
          title: 'Failed to copy',
          description: 'Could not copy the link to clipboard.',
        });
      }
    }
  };

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        const response = await getBlogBySlug(slug as string);
        if (response.success) {
          setBlog(response.data);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Fetch blog error:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="container animate-pulse py-20 px-4">
        <div className="mx-auto h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mx-auto mt-8 h-12 max-w-3xl rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mx-auto mt-12 aspect-video max-w-5xl rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    );
  }

  if (error || !blog) {
    notFound();
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Simple FAQ parser (since Gemini returns FAQ in the content or separately in the schema)
  // For now, we'll try to extract them if they follow the Q: and A: format
  const extractFAQs = (content: string) => {
    const faqs: { question: string, answer: string }[] = [];
    const lines = content.split('\n');
    let currentQ = '';

    lines.forEach(line => {
      if (line.toLowerCase().includes('q:') || line.toLowerCase().includes('question:')) {
        currentQ = line.replace(/^[#*\s]*[qQ](uestion)?:\s*/i, '').trim();
      } else if ((line.toLowerCase().includes('a:') || line.toLowerCase().includes('answer:')) && currentQ) {
        faqs.push({
          question: currentQ,
          answer: line.replace(/^[#*\s]*[aA](nswer)?:\s*/i, '').trim()
        });
        currentQ = '';
      }
    });

    return faqs;
  };

  const faqs = extractFAQs(blog.content);

  return (
    <article className="pb-24">
      {/* Hero Header */}
      <header className="container relative py-12 px-4 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:gap-3 transition-all dark:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-500">
            <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-1.5 dark:bg-neutral-800">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-1.5 dark:bg-neutral-800">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>{blog.readingTime} min read</span>
            </div>
            <button
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
            {blog.title}
          </h1>


        </div>
      </header>

      {/* Featured Image */}
      <div className="container px-2">
        <div className="relative mx-auto aspect-[21/9] max-w-6xl overflow-hidden rounded-[2.5rem] shadow-2xl shadow-indigo-500/10">
          <Image
            src={blog.image.url}
            alt={blog.image.alt}
            fill
            className="object-cover"
            priority
          />
          {blog.image.credit && (
            <div className="absolute bottom-1 right-2 rounded-lg bg-black/50 px-1 py-1 text-[5px] text-white backdrop-blur-md">
              {blog.image.credit}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container relative z-10 mt-8 px-4 sm:mt-12">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-white p-6 border border-neutral-100 shadow-xl shadow-neutral-200/50 dark:bg-neutral-950 dark:border-neutral-800 dark:shadow-none sm:p-12">
          {/* Tags */}
          <div className="mb-10 flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <div
                key={tag}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-100 bg-neutral-50 px-2 py-2 text-sm font-bold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
              >
                <Tag className="h-3.5 w-3.5" />
                {tag}
              </div>
            ))}
          </div>

          {/* Render Markdown Content */}
          <BlogContent content={blog.content} />

          {/* FAQ Section */}
          <FAQSection faqs={faqs} />

          {/* Post Footer */}
          <div className="mt-20 border-t border-neutral-100 pt-16 dark:border-neutral-800">
            <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-neutral-900 dark:text-white">Written by AI</h4>
                  <p className="text-sm text-neutral-500">Crafted with Gemini 1.5</p>
                </div>
              </div>
              <Link
                href="/"
                className="group flex items-center gap-2 rounded-2xl bg-neutral-900 px-8 py-4 font-bold text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
              >
                Explore More Topics
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
