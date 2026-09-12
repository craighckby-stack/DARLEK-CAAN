// Type definitions for Next.js cacheLife configs

declare module 'next/cache' {
  export { unstable_cache } from 'next/dist/server/web/spec-extension/unstable-cache'
  export {
    revalidateTag,
    revalidatePath,
    unstable_expireTag,
    unstable_expirePath,
  } from 'next/dist/server/web/spec-extension/revalidate'
  export { unstable_noStore } from 'next/dist/server/web/spec-extension/unstable-no-store'

  export type CacheLifeProfile =
    | "default"
    | "seconds"
    | "minutes"
    | "hours"
    | "days"
    | "weeks"
    | "max"

  export interface CustomCacheLifeConfig {
    /**
     * This cache may be stale on clients for ... seconds before checking with the server.
     */
    stale?: number
    /**
     * If the server receives a new request after ... seconds, start revalidating new values in the background.
     */
    revalidate?: number
    /**
     * If this entry has no traffic for ... seconds it will expire. The next request will recompute it.
     */
    expire?: number
  }

  /**
   * Cache this `"use cache"` for a timespan defined by a standard profile or custom configuration.
   */
  export function unstable_cacheLife(profile: CacheLifeProfile | CustomCacheLifeConfig): void

  export { cacheTag as unstable_cacheTag } from 'next/dist/server/use-cache/cache-tag'
}