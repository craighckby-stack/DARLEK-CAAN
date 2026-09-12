"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

export type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root>

const SEPARATOR_BASE_STYLES = "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px" as const

export const Separator: React.ForwardRefExoticComponent<
  SeparatorProps & React.RefAttributes<React.ElementRef<typeof SeparatorPrimitive.Root>>
> = React.forwardRef<
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
  const computedClassName: string = React.useMemo(
    () => cn(SEPARATOR_BASE_STYLES, className),
    [className]
  )

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={computedClassName}
      {...props}
    />
  )
})

Separator.displayName = SeparatorPrimitive.Root.displayName