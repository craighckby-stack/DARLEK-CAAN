/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/components/ui/badge.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const BADGE_BASE_STYLES = "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/25 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden"

const badgeVariants = cva(BADGE_BASE_STYLES, {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
      secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
      destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
      outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  /**
   * Change the underlying element to the passed child, merging props and behavior.
   */
  asChild?: boolean
}

const MEMO_COMPONENTS = {
  span: "span",
  slot: Slot,
} as const

const Badge = React.memo(function Badge({
  className,
  variant,
  asChild = false,
  ...restProps
}: BadgeProps) {
  const Component = asChild ? MEMO_COMPONENTS.slot : MEMO_COMPONENTS.span

  return (
    <Component
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...restProps}
    />
  )
})

Badge.displayName = "Badge"

export { Badge, badgeVariants }