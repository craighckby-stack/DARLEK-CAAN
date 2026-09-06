"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as SonnerPrimitive, ToasterProps } from "sonner"

const FALLBACK_THEME = "system" as const

const TOASTER_CSS_VARIABLES = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
} as const satisfies React.CSSProperties

function useResolvedTheme(propTheme?: ToasterProps["theme"]): ToasterProps["theme"] {
  const { theme: currentSystemTheme = FALLBACK_THEME } = useTheme()

  return React.useMemo(() => {
    if (propTheme !== undefined) {
      return propTheme
    }

    if (currentSystemTheme === "light" || currentSystemTheme === "dark" || currentSystemTheme === "system") {
      return currentSystemTheme
    }

    return FALLBACK_THEME
  }, [propTheme, currentSystemTheme])
}

const Toaster: React.NamedExoticComponent<ToasterProps> = React.memo(
  function Toaster({ theme: propTheme, ...props }: ToasterProps): React.JSX.Element {
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