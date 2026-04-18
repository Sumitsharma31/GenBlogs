import { Metadata } from 'next';

// Define the fetch function to get blog data server-side for SEO
async function getBlogForSEO(slug: string) {
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8080';
  try {
    // We use next: { revalidate: 3600 } to cache the result for 1 hour to prevent hammering the backend
    const res = await fetch(`${backendUrl}/blogs/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await getBlogForSEO(resolvedParams.slug);

  if (!blog) {
    return {
      title: 'Blog Not Found | GenBlog',
      description: 'The requested blog post could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-blog-platform.vercel.app';

  return {
    title: blog.title,
    description: blog.excerpt || blog.metaDescription || `Read ${blog.title} on GenBlog.`,
    keywords: ["genblog", "genblog ai", "gen blog", ...(blog.tags || [])],
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.metaDescription,
      url: `${siteUrl}/blog/${blog.slug}`,
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      authors: ['GenBlog AI'],
      images: [
        {
          url: blog.image?.url || `${siteUrl}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: blog.image?.alt || blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || blog.metaDescription,
      images: [blog.image?.url || `${siteUrl}/default-og-image.jpg`],
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
