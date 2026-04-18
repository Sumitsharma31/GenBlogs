import React from 'react';
import { Blog } from '@/types';
import { Eye, Trash2, CheckCircle, Clock as ClockIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminBlogRowProps {
  blog: Blog;
  onStatusToggle: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

const AdminBlogRow: React.FC<AdminBlogRowProps> = ({ blog, onStatusToggle, onDelete }) => {
  const isPublished = blog.status === 'published';

  return (
    <tr className="group border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50">
      <td className="py-6 px-4">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
            {blog.image.url && (
              <img src={blog.image.url} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="max-w-md">
            <h4 className="line-clamp-1 font-bold text-neutral-900 dark:text-white">{blog.title}</h4>
            <p className="line-clamp-1 text-xs text-neutral-500">{blog.excerpt}</p>
          </div>
        </div>
      </td>
      <td className="py-6 px-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${isPublished
            ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400'
            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
          }`}>
          {isPublished ? <CheckCircle className="h-3 w-3" /> : <ClockIcon className="h-3 w-3" />}
          {blog.status}
        </span>
      </td>
      <td className="py-6 px-4">
        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="py-6 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/blog/${blog.slug}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-white hover:text-indigo-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-indigo-400"
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onStatusToggle(blog._id, blog.status)}
            className={`flex h-9 px-4 items-center gap-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${isPublished
                ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
          >
            {isPublished ? 'Unpublish' : 'Publish Now'}
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this blog?')) onDelete(blog._id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminBlogRow;
