import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "GenBlog | Smart Content Platform",
  description: "Experience high-quality, AI-generated blog posts on trending topics.",
  openGraph: {
    title: "GenBlog | Smart Content Platform",
    description: "Experience high-quality, AI-generated blog posts on trending topics.",
    type: "website",
    locale: "en_US",
    url: "https://ai-blog-platform.vercel.app",
    siteName: "GenBlog",
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
