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

const ZERO_PERCENT_TRANSFORM: string = "translateX(-100%)"

/**
 * Clamps and normalizes a progress value within valid boundaries with strict type guards.
 */
function clampProgressValue(value: number | null | undefined, max: number): number {
  if (value == null || Number.isNaN(value)) return 0
  if (value <= 0) return 0
  if (value >= max) return max
  return value
}

/**
 * Computes the translateX percentage string for the progress indicator element.
 */
function getIndicatorTransform(percentage: number): string {
  if (percentage === 0) return ZERO_PERCENT_TRANSFORM
  return `translateX(-${100 - percentage}%)`
}

const Progress = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressProps
  >(({ className, value, max = 100, ...props }, ref) => {
    const validMax: number = max > 0 ? max : 100
    const clampedValue: number = clampProgressValue(value, validMax)
    
    const percentage: number = clampedValue === 0 
      ? 0 
      : clampedValue === validMax 
        ? 100 
        : (clampedValue / validMax) * 100

    const indicatorTransform: string = getIndicatorTransform(percentage)

    return (
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={validMax}
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