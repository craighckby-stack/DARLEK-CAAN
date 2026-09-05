"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as SonnerPrimitive, ToasterProps } from "sonner"

const TOASTER_DEFAULT_THEME = "system" as const

/**
 * Resolves the active theme for the Sonner toaster component,
 * prioritizing explicit component props over context-driven theme values.
 */
function useResolvedTheme(propTheme?: ToasterProps["theme"]): ToasterProps["theme"] {
  const { theme = TOASTER_DEFAULT_THEME } = useTheme()

  return React.useMemo(() => {
    if (propTheme) {
      return propTheme
    }

    if (theme === "light" || theme === "dark" || theme === "system") {
      return theme
    }

    return TOASTER_DEFAULT_THEME
  }, [propTheme, theme])
}

const TOASTER_CSS_VARIABLES = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
} as const satisfies React.CSSProperties

/**
 * Enhanced Toaster component integrating next-themes with Sonner.
 * Features optimized memoization, strict type safety, and clean architectural separation.
 */
const Toaster: React.NamedExoticComponent<ToasterProps> = React.memo(
  ({ theme: propTheme, ...props }: ToasterProps): React.JSX.Element => {
    const resolvedTheme = useResolvedTheme(propTheme)

    return (
      <SonnerPrimitive
        theme={resolvedTheme}
        className="toaster group"
        style={TOASTER_CSS_VARIABLES}
        {...props}
      />
    )
  }
)

Toaster.displayName = "Toaster"

export { Toaster }