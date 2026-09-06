"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

export type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>

const DEFAULT_RANGE_MIN = 0
const DEFAULT_RANGE_MAX = 100

/**
 * Extracts and normalizes numerical thumb values from component props with minimal allocations.
 */
function useSliderValues(
  value: SliderProps["value"],
  defaultValue: SliderProps["defaultValue"],
  min: number,
  max: number
): number[] {
  return React.useMemo(() => {
    if (value !== undefined && Array.isArray(value)) return value
    if (defaultValue !== undefined && Array.isArray(defaultValue)) return defaultValue
    return [min, max]
  }, [value, defaultValue, min, max])
}

const TRACK_CLASS = "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
const RANGE_CLASS = "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
const THUMB_CLASS = "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
const ROOT_BASE_CLASS = "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"

/**
 * Modernized Slider component built on top of Radix UI primitives, optimized for minimal re-renders and memory footprint.
 */
const Slider = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    SliderProps
  >(({ className, defaultValue, value, min = DEFAULT_RANGE_MIN, max = DEFAULT_RANGE_MAX, ...props }, ref) => {
    const activeValues = useSliderValues(value, defaultValue, min, max)

    const thumbs = React.useMemo(() => {
      const length = activeValues.length
      const elements = new Array(length)
      for (let i = 0; i < length; i++) {
        elements[i] = (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={i}
            className={THUMB_CLASS}
          />
        )
      }
      return elements
    }, [activeValues])

    const rootClassName = React.useMemo(
      () => cn(ROOT_BASE_CLASS, className),
      [className]
    )

    return (
      <SliderPrimitive.Root
        ref={ref}
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={rootClassName}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={TRACK_CLASS}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={RANGE_CLASS}
          />
        </SliderPrimitive.Track>
        {thumbs}
      </SliderPrimitive.Root>
    )
  })
)

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }