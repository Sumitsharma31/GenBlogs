import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Blog } from '@/types';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border bg-white transition-all hover:scale-[1.01] hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 dark:overflow-hidden dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-indigo-900/50">
      {/* Image Container */}
      <Link href={`/blog/${blog.slug}`} className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={blog.image.url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200'}
          alt={blog.image.alt || blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {blog.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/30 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/blog/${blog.slug}`} className="mb-4 block">
          <h3 className="line-clamp-2 text-xl font-bold leading-tight text-neutral-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 sm:text-2xl">
            {blog.title}
          </h3>
        </Link>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-6 dark:border-neutral-800">
          <div className="flex items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{blog.readingTime} min read</span>
            </div>
          </div>

          <Link
            href={`/blog/${blog.slug}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 transition-all group-hover:bg-indigo-600 group-hover:text-white active:scale-90 dark:bg-neutral-800 dark:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
