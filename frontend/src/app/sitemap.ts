import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-blog-platform.vercel.app';
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8080';

  let blogs: any[] = [];
  try {
    const res = await fetch(`${backendUrl}/blogs?limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        blogs = data.data;
      }
    }
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error);
  }

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...blogEntries,
  ];
}
