"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

export type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root>

/**
 * Architectural style constants for the separator component.
 * Handles responsive sizing and layout based on Radix UI orientation states.
 */
const SEPARATOR_BASE_STYLES = "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px" as const

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(function Separator(
  {
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
  },
  ref
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(SEPARATOR_BASE_STYLES, className)}
      {...props}
    />
  )
})

Separator.displayName = SeparatorPrimitive.Root.displayName