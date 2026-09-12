"use client"

/**
 * @fileoverview Accessible tooltip components built on top of Radix UI primitives.
 * Provides optimized readability, modern React patterns, and consistent styling.
 */

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// ============================================================================
// Types & Definitions
// ============================================================================

export type TooltipProviderProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
export type TooltipProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>
export type TooltipTriggerProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
export type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>

// ============================================================================
// Style Constants
// ============================================================================

const TOOLTIP_CONTENT_STYLES = cn(
  "z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
  "bg-primary text-primary-foreground",
  "animate-in fade-in-0 zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  "data-[side=bottom]:slide-in-from-top-2",
  "data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2",
  "data-[side=top]:slide-in-from-bottom-2",
  "origin-(--radix-tooltip-content-transform-origin)"
)

const TOOLTIP_ARROW_STYLES = "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-primary fill-primary"

// ============================================================================
// Components
// ============================================================================

/**
 * Context provider for tooltip delay settings and global configurations.
 */
export const TooltipProvider: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<TooltipProviderProps & React.RefAttributes<HTMLDivElement>>
> = React.memo<TooltipProviderProps>(function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
})

TooltipProvider.displayName = "TooltipProvider"

/**
 * Root container managing tooltip open/closed state.
 */
export const Tooltip: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLDivElement>>
> = React.memo<TooltipProps>(function Tooltip(props) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
})

Tooltip.displayName = "Tooltip"

/**
 * Interactive element that triggers the tooltip display upon focus or hover.
 */
export const TooltipTrigger: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<TooltipTriggerProps & React.RefAttributes<HTMLButtonElement>>
> = React.memo<TooltipTriggerProps>(function TooltipTrigger(props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
})

TooltipTrigger.displayName = "TooltipTrigger"

/**
 * Floating container displaying the tooltip content and directional arrow.
 */
export const TooltipContent: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<TooltipContentProps & React.RefAttributes<HTMLDivElement>>
> = React.memo<TooltipContentProps>(function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  const computedClassName = React.useMemo(() => {
    return className ? cn(TOOLTIP_CONTENT_STYLES, className) : TOOLTIP_CONTENT_STYLES
  }, [className])

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={computedClassName}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className={TOOLTIP_ARROW_STYLES} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
})

TooltipContent.displayName = "TooltipContent"