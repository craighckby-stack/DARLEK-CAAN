"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ScrollAreaProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  /** Optional custom styling classes for the underlying scrollable viewport element. */
  viewportClassName?: string
  /** Optional external reference forwarder for the viewport DOM node. */
  viewportRef?: React.Ref<HTMLDivElement>
}

export interface ScrollBarProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {}

// ============================================================================
// Constants & Styles
// ============================================================================

const SCROLL_AREA_STYLES = {
  root: "relative overflow-hidden",
  viewport: cn(
    "size-full rounded-[inherit] outline-none",
    "transition-[color,box-shadow]",
    "focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50"
  ),
  scrollbar: {
    base: "flex touch-none p-px transition-colors select-none",
    vertical: "h-full w-2.5 border-l border-l-transparent",
    horizontal: "h-2.5 flex-col border-t border-t-transparent",
  },
  thumb: "relative flex-1 rounded-full bg-border",
} as const

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Custom-styled scrollbar supporting both vertical and horizontal orientations.
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", ...props }, ref) => {
  const isVertical = orientation === "vertical"
  const isHorizontal = orientation === "horizontal"

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        SCROLL_AREA_STYLES.scrollbar.base,
        isVertical && SCROLL_AREA_STYLES.scrollbar.vertical,
        isHorizontal && SCROLL_AREA_STYLES.scrollbar.horizontal,
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={SCROLL_AREA_STYLES.thumb}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
})

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// ============================================================================
// Main Component
// ============================================================================

/**
 * Pristine wrapper around Radix UI ScrollArea providing modern styling idioms
 * and decoupled architectural clarity.
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, viewportClassName, viewportRef, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    data-slot="scroll-area"
    className={cn(SCROLL_AREA_STYLES.root, className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      ref={viewportRef}
      data-slot="scroll-area-viewport"
      className={cn(SCROLL_AREA_STYLES.viewport, viewportClassName)}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

// ============================================================================
// Exports
// ============================================================================

export { ScrollArea, ScrollBar }