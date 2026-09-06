"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Optional custom icon override for the checkbox indicator */
  icon?: React.ReactNode
}

// Hoist static class strings to prevent constant string recreation per render cycle
const ROOT_BASE_CLASSES = "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
const INDICATOR_BASE_CLASSES = "flex items-center justify-center text-current transition-none"
const DEFAULT_ICON = <CheckIcon className="size-3.5" />

/**
 * Modernized Checkbox component utilizing Radix UI primitives and Tailwind CSS.
 * Optimized for maximum execution speed, reduced memory allocations, and minimal re-renders.
 */
const Checkbox = React.memo(
  React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    CheckboxProps
  >(({ className, icon, ...props }, ref) => {
    // Memoize className computations to avoid redundant string concatenation allocations
    const rootStyles = React.useMemo(() => {
      if (!className) return ROOT_BASE_CLASSES
      return `${ROOT_BASE_CLASSES} ${className}`
    }, [className])

    const indicatorContent = icon ?? DEFAULT_ICON

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        data-slot="checkbox"
        className={rootStyles}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className={INDICATOR_BASE_CLASSES}
        >
          {indicatorContent}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  })
)

Checkbox.displayName = "Checkbox"

export { Checkbox }