import * as React from "react"

/**
 * The standard mobile layout breakpoint query matching screens below 768px.
 */
const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)" as const

/**
 * Lazily initializes and caches the global MediaQueryList instance to prevent redundant allocations.
 */
let sharedMediaQueryList: MediaQueryList | null = null

function getCachedMediaQueryList(): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null
  }

  if (!sharedMediaQueryList) {
    try {
      sharedMediaQueryList = window.matchMedia(MOBILE_BREAKPOINT_QUERY)
    } catch {
      return null
    }
  }

  return sharedMediaQueryList
}

/**
 * Resolves the initial mobile state safely across server and client environments.
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
    
    if (!mediaQueryList) {
      return
    }

    const handleBreakpointChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches)
    }

    // Sync current state immediately upon mount
    setIsMobile(mediaQueryList.matches)

    // Modern browsers support addEventListener/removeEventListener on MediaQueryList
    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleBreakpointChange)
      return () => {
        mediaQueryList.removeEventListener("change", handleBreakpointChange)
      }
    } 
    // Fallback for legacy environments supportingaddListener
    else if (typeof (mediaQueryList as MediaQueryList & { addListener?: (listener: (event: MediaQueryListEvent) => void) => void }).addListener === "function") {
      const legacyQuery = mediaQueryList as MediaQueryList & {
        addListener: (listener: (event: MediaQueryListEvent) => void) => void
        removeListener: (listener: (event: MediaQueryListEvent) => void) => void
      }
      legacyQuery.addListener(handleBreakpointChange)
      return () => {
        legacyQuery.removeListener(handleBreakpointChange)
      }
    }
  }, [])

  return isMobile
}