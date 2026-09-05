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

  export interface CacheLifeConfig {
    /**
     * Duration in seconds the cache may remain stale on clients before re-verifying with the server.
     */
    readonly stale?: number

    /**
     * Duration in seconds after which a subsequent request triggers background value revalidation.
     */
    readonly revalidate?: number

    /**
     * Duration of inactivity in seconds before the cache entry expires and requires recomputation.
     */
    readonly expire?: number
  }

  type CacheProfile = 'default' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'max'

  /**
   * Applies a predefined caching profile to `"use cache"` directives.
   */
  export function unstable_cacheLife(profile: CacheProfile): void

  /**
   * Applies a custom caching configuration span to `"use cache"` directives.
   * 
   * Maps conceptually to: `Cache-Control: max-age=stale, s-maxage=revalidate, stale-while-revalidate=expire-revalidate`
   * 
   * Omitted properties inherit values from fallback profiles or previous cascaded settings.
   */
  export function unstable_cacheLife(profile: Readonly<CacheLifeConfig>): void

  export { cacheTag as unstable_cacheTag } from 'next/dist/server/use-cache/cache-tag'
}