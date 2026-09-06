import * as React from "react"

/**
 * The standard mobile layout breakpoint in pixels (matches Tailwind's 'md' prefix minus 1px).
 */
const MOBILE_QUERY = "(max-width: 767px)" as const

/**
 * Cached global MediaQueryList instance to prevent repeated allocations during SSR/client transitions.
 */
let mediaQueryListCache: MediaQueryList | null = null

const getMediaQueryList = (): MediaQueryList | null => {
  if (typeof window === "undefined") {
    return null
  }
  if (!mediaQueryListCache) {
    mediaQueryListCache = window.matchMedia(MOBILE_QUERY)
  }
  return mediaQueryListCache
}

/**
 * Initial state initializer using direct evaluation to avoid redundant state allocations.
 */
const getInitialState = (): boolean => {
  const mql = getMediaQueryList()
  return mql ? mql.matches : false
}

/**
 * React hook that tracks and returns whether the current viewport matches mobile screen dimensions.
 * Utilizes matchMedia for high-performance reactive updates with optimized memory footprints and cached queries.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(getInitialState)

  React.useEffect(() => {
    const mediaQueryList = getMediaQueryList()
    if (!mediaQueryList) {
      return
    }

    const handleMediaQueryChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches)
    }

    // Ensure strict synchronization on mount
    setIsMobile(mediaQueryList.matches)

    mediaQueryList.addEventListener("change", handleMediaQueryChange)

    return () => {
      mediaQueryList.removeEventListener("change", handleMediaQueryChange)
    }
  }, [])

  return isMobile
}