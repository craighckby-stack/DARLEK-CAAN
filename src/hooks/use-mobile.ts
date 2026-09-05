import * as React from "react"

/**
 * The standard mobile layout breakpoint in pixels (matches Tailwind's 'md' prefix).
 */
const MOBILE_BREAKPOINT_PX = 768 as const

/**
 * Creates a media query string targeting viewport widths strictly below the mobile breakpoint.
 */
const getMobileMediaQuery = (): string => `(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`

/**
 * Evaluates whether the current window viewport matches the mobile breakpoint criteria.
 */
const checkIsMobileViewport = (): boolean => {
  if (typeof window === "undefined") {
    return false
  }
  return window.innerWidth < MOBILE_BREAKPOINT_PX
}

/**
 * React hook that tracks and returns whether the current viewport matches mobile screen dimensions.
 * Utilizes matchMedia for high-performance reactive updates.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(checkIsMobileViewport)

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQueryList = window.matchMedia(getMobileMediaQuery())

    const handleMediaQueryChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches)
    }

    // Synchronize state immediately on mount to catch any layout shifts
    setIsMobile(mediaQueryList.matches)

    mediaQueryList.addEventListener("change", handleMediaQueryChange)

    return () => {
      mediaQueryList.removeEventListener("change", handleMediaQueryChange)
    }
  }, [])

  return isMobile
}