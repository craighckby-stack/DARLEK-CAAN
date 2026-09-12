/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/components/ui/checkbox.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */


import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Optional custom icon override for the checkbox indicator */
  icon?: React.ReactNode
}

const ROOT_STYLES = cn(
  "peer border-input dark:bg-input/30 size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary",
  "dark:data-[state=checked]:bg-primary",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

const INDICATOR_STYLES = "flex items-center justify-center text-current transition-none"
const DEFAULT_CHECK_ICON = <CheckIcon className="size-3.5" />

/**
 * Checkbox component utilizing Radix UI primitives and Tailwind CSS.
 * Structured for clarity, maintainability, and architectural separation.
 */
const Checkbox = React.memo(
  React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    CheckboxProps
  >(({ className, icon = DEFAULT_CHECK_ICON, ...props }, ref) => {
    const computedRootClasses = React.useMemo(
      () => cn(ROOT_STYLES, className),
      [className]
    )

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        data-slot="checkbox"
        className={computedRootClasses}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className={INDICATOR_STYLES}
        >
          {icon}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  })
)

Checkbox.displayName = "Checkbox"

export { Checkbox }