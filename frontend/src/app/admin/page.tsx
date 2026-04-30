'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBlogs, updateBlogStatus, deleteBlog, generateBlog, logout } from '@/lib/api';
import { Blog, PaginatedResponse } from '@/types';
import AdminBlogRow from '@/components/AdminBlogRow';
import { useToast } from '@/components/ToastProvider';
import { 
  LayoutDashboard, 
  Plus, 
  RefreshCw, 
  Search, 
  AlertCircle,
  BarChart3,
  FileText,
  CheckCircle2,
  Settings,
  Sparkles,
  LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
  const router = useRouter();
  const { toast } = useToast();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Blog> = await getBlogs(1, 50, true);
      if (response.success) {
        setBlogs(response.data);
        const publishedCount = response.data.filter(b => b.status === 'published').length;
        setStats({
          total: response.data.length,
          published: publishedCount,
          drafts: response.data.length - publishedCount
        });
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/admin/login');
      } else {
        setError('Failed to fetch blogs from API');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    fetchBlogs();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const response = await updateBlogStatus(id, newStatus as 'draft' | 'published');
      if (response.success) {
        setBlogs(blogs.map(b => b._id === id ? { ...b, status: newStatus as 'draft' | 'published' } : b));
        fetchBlogs(); // Refresh stats
        toast({
          type: 'success',
          title: 'Status updated',
          description: `Article moved to ${newStatus}.`,
        });
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        router.push('/admin/login');
        return;
      }
      toast({
        type: 'error',
        title: 'Failed to update status',
        description: 'Please try again.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteBlog(id);
      if (response.success) {
        setBlogs(blogs.filter(b => b._id !== id));
        fetchBlogs(); // Refresh stats
        toast({
          type: 'success',
          title: 'Deleted',
          description: 'Article removed successfully.',
        });
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        router.push('/admin/login');
        return;
      }
      toast({
        type: 'error',
        title: 'Failed to delete',
        description: 'Please try again.',
      });
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      setGenerating(true);
      const response = await generateBlog(topic);
      if (response.success) {
        setTopic('');
        fetchBlogs();
        toast({
          type: 'success',
          title: 'Article generated',
          description: 'Saved as draft in your dashboard.',
          durationMs: 5000,
        });
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast({
          type: 'error',
          title: 'Session Expired',
          description: 'Please login again to continue.',
        });
        logout();
        router.push('/admin/login');
        return;
      }
      const message = err.response?.data?.message || 'Failed to generate blog. Check if Gemini API key is valid.';
      toast({
        type: 'error',
        title: 'Generation failed',
        description: message,
        durationMs: 6500,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4 sm:px-8">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Area */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
              <LayoutDashboard className="h-5 w-5" />
              <span>Admin Center</span>
            </div>
            <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white">Content Management</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchBlogs}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-bold text-neutral-600 transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { label: 'Total Articles', value: stats.total, icon: FileText, color: 'indigo' },
            { label: 'Published', value: stats.published, icon: CheckCircle2, color: 'green' },
            { label: 'Pending Drafts', value: stats.drafts, icon: BarChart3, color: 'amber' }
          ].map((stat, i) => (
            <div key={i} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="mb-4 flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${stat.color}-600/10 text-${stat.color}-600`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-black text-neutral-900 dark:text-white">{stat.value}</div>
              </div>
              <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Generate Panel */}
        <div className="mb-12 overflow-hidden rounded-[2.5rem] bg-indigo-600 p-1 shadow-2xl shadow-indigo-500/20">
          <div className="rounded-[2.4rem] bg-indigo-600 px-8 py-10 text-white">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold">Instant AI Generator</h3>
                <p className="text-sm text-indigo-100/70">Create a high-quality blog post in seconds</p>
              </div>
            </div>
            
            <form onSubmit={handleGenerate} className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-300" />
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter any topic (e.g. 'The impact of AI on UX design')" 
                  className="w-full rounded-2xl bg-white/10 border border-white/20 pl-12 pr-6 py-4 text-white placeholder:text-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={generating}
                />
              </div>
              <button 
                type="submit"
                disabled={generating || !topic.trim()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-black text-indigo-600 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {generating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                {generating ? 'Generating Blog...' : 'Create Article'}
              </button>
            </form>
          </div>
        </div>

        {/* Content Table */}
        <div className="rounded-[2.5rem] border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 overflow-hidden">
          <div className="border-b border-neutral-100 bg-neutral-50/50 px-8 py-6 dark:border-neutral-800 dark:bg-neutral-900/80 flex items-center justify-between">
            <h3 className="font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              All Content
            </h3>
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Showing {blogs.length} items
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/30 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:border-neutral-800 dark:bg-transparent">
                  <th className="py-4 px-8">Article</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-neutral-100 dark:border-neutral-800">
                      <td className="py-8 px-8"><div className="h-10 w-48 rounded bg-neutral-100 dark:bg-neutral-800" /></td>
                      <td className="py-8 px-4"><div className="h-6 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800" /></td>
                      <td className="py-8 px-4"><div className="h-4 w-24 rounded bg-neutral-100 dark:bg-neutral-800" /></td>
                      <td className="py-8 px-8"><div className="ml-auto h-9 w-32 rounded bg-neutral-100 dark:bg-neutral-800" /></td>
                    </tr>
                  ))
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <AlertCircle className="h-12 w-12 text-neutral-200" />
                        <p className="font-bold text-neutral-400">No content found. Start by generating an article above.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  blogs.map(blog => (
                    <AdminBlogRow 
                      key={blog._id} 
                      blog={blog} 
                      onStatusToggle={handleStatusToggle}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
