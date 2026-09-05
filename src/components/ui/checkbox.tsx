"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Optional custom icon override for the checkbox indicator */
  icon?: React.ReactNode
}

/**
 * Modernized Checkbox component utilizing Radix UI primitives and Tailwind CSS.
 * Optimized for readability with modular decomposition of layout elements.
 */
const Checkbox = React.memo(
  React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    CheckboxProps
  >(({ className, icon, ...props }, ref) => {
    const indicatorContent = icon ?? <CheckIcon className="size-3.5" />

    const rootStyles = cn(
      "peer border-input dark:bg-input/30",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary",
      "focus-visible:border-ring focus-visible:ring-ring/50",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      "size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none",
      "focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      className
    )

    const indicatorStyles = cn(
      "flex items-center justify-center text-current transition-none"
    )

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        data-slot="checkbox"
        className={rootStyles}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className={indicatorStyles}
        >
          {indicatorContent}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  })
)

Checkbox.displayName = "Checkbox"

export { Checkbox }