import * as React from "react"

/**
 * Standard mobile layout breakpoint query matching screens below 768px.
 */
const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)" as const

/**
 * Caches the global MediaQueryList instance to prevent redundant allocations.
 */
let sharedMediaQueryList: MediaQueryList | null = null

function getCachedMediaQueryList(): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null
  }

  if (sharedMediaQueryList === null) {
    try {
      sharedMediaQueryList = window.matchMedia(MOBILE_BREAKPOINT_QUERY)
    } catch {
      return null
    }
  }

  return sharedMediaQueryList
}

/**
 * Resolves initial mobile state across server and client environments.
 */
function evaluateInitialMobileState(): boolean {
  const mediaQueryList = getCachedMediaQueryList()
  return mediaQueryList?.matches ?? false
}

/**
 * React hook that monitors viewport dimensions and returns whether the current layout matches mobile specifications.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(evaluateInitialMobileState)

  React.useEffect(() => {
    const mediaQueryList = getCachedMediaQueryList()
    
    if (mediaQueryList === null) {
      return
    }

    const handleBreakpointChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches)
    }

    setIsMobile(mediaQueryList.matches)

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleBreakpointChange)
      return () => {
        mediaQueryList.removeEventListener("change", handleBreakpointChange)
      }
    } 
    
    const legacyQuery = mediaQueryList as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void
    }

    if (typeof legacyQuery.addListener === "function" && typeof legacyQuery.removeListener === "function") {
      legacyQuery.addListener(handleBreakpointChange)
      return () => {
        legacyQuery.removeListener!(handleBreakpointChange)
      }
    }
  }, [])

  return isMobile
}