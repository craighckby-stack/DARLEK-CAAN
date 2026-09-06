"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ScrollAreaProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  viewportClassName?: string
  viewportRef?: React.Ref<HTMLDivElement>
}

export interface ScrollBarProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {}

// ============================================================================
// Constants & Static Class Maps (Optimized for zero allocation overhead)
// ============================================================================

const ROOT_CLASS = "relative overflow-hidden"
const VIEWPORT_CLASS = "size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50"
const SCROLLBAR_BASE = "flex touch-none p-px transition-colors select-none"
const SCROLLBAR_VERTICAL = "h-full w-2.5 border-l border-l-transparent"
const SCROLLBAR_HORIZONTAL = "h-2.5 flex-col border-t border-t-transparent"
const THUMB_CLASS = "relative flex-1 rounded-full bg-border"

// ============================================================================
// Sub-Components
// ============================================================================

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", ...props }, ref) => {
  const isVertical = orientation === "vertical"

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        SCROLLBAR_BASE,
        isVertical ? SCROLLBAR_VERTICAL : SCROLLBAR_HORIZONTAL,
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={THUMB_CLASS}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
})

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// ============================================================================
// Main Component
// ============================================================================

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, viewportClassName, viewportRef, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area"
      className={cn(ROOT_CLASS, className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        className={cn(VIEWPORT_CLASS, viewportClassName)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

// ============================================================================
// Exports
// ============================================================================

export { ScrollArea, ScrollBar }