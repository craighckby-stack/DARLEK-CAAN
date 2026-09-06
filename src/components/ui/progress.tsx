"use client"

/**
 * @file src/components/ui/progress.tsx
 * @description Accessible, highly performant progress bar component built on Radix UI primitives.
 */

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** The current progress value. Accepts null or undefined for indeterminate states or uninitialized values. */
  value?: number | null
  /** The maximum boundary value for progress computation. Defaults to 100. */
  max?: number
}

// Pre-allocate style object/string cache structures to minimize runtime garbage collection overhead
const ZERO_PERCENT_TRANSFORM = "translateX(-100%)"

/**
 * Calculates a sanitized and bounded percentage representation from a raw value and maximum boundary.
 * Optimized with primitive branching to avoid redundant evaluations.
 */
function calculateProgressPercentage(value: number | null | undefined, max: number): number {
  if (value == null || Number.isNaN(value)) return 0
  if (value <= 0) return 0
  if (value >= max) return 100
  return (value / max) * 100
}

const Progress = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressProps
  >(({ className, value, max = 100, ...props }, ref) => {
    // Single-pass computation for valid value and bounds
    const safeValue = typeof value === "number" && !Number.isNaN(value) ? value : 0
    const clampedValue = safeValue < 0 ? 0 : safeValue > max ? max : safeValue
    
    // Compute percentage directly using conditional shortcuts
    const percentage = max > 0 
      ? (clampedValue === 0 ? 0 : clampedValue === max ? 100 : (clampedValue / max) * 100)
      : 0

    const indicatorTransform = percentage === 0 
      ? ZERO_PERCENT_TRANSFORM 
      : `translateX(-${100 - percentage}%)`

    return (
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full w-full flex-1 bg-primary transition-transform duration-300 ease-in-out will-change-transform"
          style={{ transform: indicatorTransform }}
        />
      </ProgressPrimitive.Root>
    )
  })
)

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }