import { JSX, Suspense, memo } from 'react';
import PageClient from '@/components/PageClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';
export const revalidate = 0;

/**
 * Fallback skeleton for the initial suspension boundary.
 * Memoized to prevent redundant renders and optimized for minimal paint overhead.
 */
const PageLoadingSkeleton = memo(function PageLoadingSkeleton(): JSX.Element {
  return (
    <div 
      aria-hidden="true" 
      className="flex min-h-screen items-center justify-center bg-background"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent motion-reduce:animate-none" />
    </div>
  );
});

PageLoadingSkeleton.displayName = 'PageLoadingSkeleton';

/**
 * Root server page component enforcing strict type safety and robust suspense architecture.
 */
export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <PageClient />
    </Suspense>
  );
}