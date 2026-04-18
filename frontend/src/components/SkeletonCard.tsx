import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900/50">
      {/* Skeleton Image */}
      <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-800" />

      {/* Skeleton Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="mb-4 flex gap-2">
          <div className="h-5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-5 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        </div>

        <div className="mb-4 space-y-2">
          <div className="h-7 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-7 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>

        <div className="mb-6 space-y-2">
          <div className="h-4 w-full rounded bg-neutral-50 dark:bg-neutral-800/50" />
          <div className="h-4 w-full rounded bg-neutral-50 dark:bg-neutral-800/50" />
          <div className="h-4 w-2/3 rounded bg-neutral-50 dark:bg-neutral-800/50" />
        </div>

        {/* Skeleton Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-6 dark:border-neutral-800">
          <div className="flex gap-4">
            <div className="h-3 w-20 rounded bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-3 w-16 rounded bg-neutral-100 dark:bg-neutral-800" />
          </div>
          <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
