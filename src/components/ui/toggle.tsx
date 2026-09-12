
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const TOGGLE_BASE_STYLES = [
  "inline-flex items-center justify-center gap-2",
  "rounded-md text-sm font-medium whitespace-nowrap",
  "transition-[color,box-shadow] outline-none",
  "hover:bg-muted hover:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "disabled:pointer-events-none disabled:opacity-50",
  "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
].join(" ")

const TOGGLE_VARIANTS = {
  variant: {
    default: "bg-transparent",
    outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
  },
  size: {
    default: "h-9 px-2 min-w-9",
    sm: "h-8 px-1.5 min-w-8",
    lg: "h-10 px-2.5 min-w-10",
  },
} as const

const TOGGLE_DEFAULT_VARIANTS = {
  variant: "default" as const,
  size: "default" as const,
}

const toggleVariants = cva(TOGGLE_BASE_STYLES, {
  variants: TOGGLE_VARIANTS,
  defaultVariants: TOGGLE_DEFAULT_VARIANTS,
})

export type ToggleRootProps = React.ComponentProps<typeof TogglePrimitive.Root>
export type ToggleVariantProps = VariantProps<typeof toggleVariants>
export type ToggleProps = ToggleRootProps & ToggleVariantProps

const Toggle = React.memo(({
  className,
  variant,
  size,
  ...props
}: ToggleProps) => {
  const computedClassName = React.useMemo(
    () => cn(toggleVariants({ variant, size, className })),
    [variant, size, className]
  )

  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={computedClassName}
      {...props}
    />
  )
})

Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }