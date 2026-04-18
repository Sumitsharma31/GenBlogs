'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogContentProps {
  content: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  return (
    <div className="prose prose-indigo max-w-none dark:prose-invert">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ ...props }) => <h2 className="scroll-mt-24 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl" {...props} />,
          h3: ({ ...props }) => <h3 className="scroll-mt-24 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white" {...props} />,
          p: ({ ...props }) => <p className="leading-relaxed text-neutral-600 dark:text-neutral-400" {...props} />,
          ul: ({ ...props }) => <ul className="my-6 list-disc space-y-2 pl-6" {...props} />,
          ol: ({ ...props }) => <ol className="my-6 list-decimal space-y-2 pl-6" {...props} />,
          li: ({ ...props }) => <li className="leading-relaxed text-neutral-600 dark:text-neutral-400" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="my-8 rounded-2xl border-l-4 border-indigo-600 bg-indigo-50/50 p-6 italic text-neutral-700 dark:bg-indigo-950/20 dark:text-neutral-300" {...props} />
          ),
          code: ({ ...props }) => (
            <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-sm text-indigo-600 dark:bg-neutral-800 dark:text-indigo-400" {...props} />
          ),
          pre: ({ ...props }) => (
            <pre className="my-8 overflow-x-auto rounded-2xl bg-neutral-900 p-6 text-neutral-100" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BlogContent;
