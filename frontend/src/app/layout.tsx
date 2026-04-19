import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    template: "%s | GenBlog - AI Smart Content Platform",
    default: "GenBlog | Premier AI-Generated Content Platform",
  },
  description: "GenBlog is an advanced AI-powered platform delivering high-quality, automated blog posts on trending topics. Experience the future of content generation with smart insights and automated blogging.",
  keywords: [
    "GenBlog",
    "GenBlog AI",
    "AI Blog Platform",
    "AI Content Generation",
    "Automated Blogging",
    "Smart Content Platform",
    "AI Writing Assistant",
    "AI Insights",
    "Trending Topics AI",
    "Content Automation",
    "Machine Learning Content",
    "AI Article Generator"
  ],
  authors: [{ name: "GenBlog AI Team", url: "https://ai-blog-platform.vercel.app" }],
  creator: "GenBlog",
  publisher: "GenBlog",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ai-blog-platform.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GenBlog | Premier AI-Generated Content Platform",
    description: "Discover high-quality, AI-powered blog posts on the latest trending topics. GenBlog simplifies content creation with advanced AI.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GenBlog AI",
    images: [
      {
        url: "/og-image.png", // Assuming an OG image exists or will be added
        width: 1200,
        height: 630,
        alt: "GenBlog AI Content Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GenBlog | AI-Powered Smart Content",
    description: "High-quality, AI-generated blog posts on trending topics. Stay ahead with GenBlog.",
    creator: "@genblog",
    images: ["/og-image.png"],
  },
  verification: {
    google: "wqUHJf-VdWUYFMO9Lf_RlVGdp3chu9z5zw0lUFliqFE",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-inter antialiased bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50`}>
        <ToastProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        
          {/* Simple Footer */}
          <footer className="border-t bg-white py-12 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-neutral-500">
                © {new Date().getFullYear()} this page maneged by @sumit
              </p>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
