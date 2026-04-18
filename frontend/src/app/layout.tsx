import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    template: "%s | GenBlog",
    default: "GenBlog | Smart Content Platform",
  },
  description: "GenBlog is your premier AI-generated smart content platform. Experience high-quality blog posts on trending topics crafted by advanced artificial intelligence.",
  keywords: ["genblog", "genblog ai", "genblog content", "gen blog", "AI blog platform", "artificial intelligence", "auto-generated content"],
  authors: [{ name: "GenBlog AI" }],
  creator: "GenBlog",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ai-blog-platform.vercel.app"),
  openGraph: {
    title: "GenBlog | Smart Content Platform",
    description: "GenBlog is your premier AI-generated smart content platform. Experience high-quality blog posts on trending topics.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GenBlog",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenBlog | Smart Content Platform",
    description: "Experience high-quality, AI-generated blog posts on trending topics.",
    creator: "@genblog",
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
