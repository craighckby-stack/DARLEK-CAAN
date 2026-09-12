"use client"
++ src/components/ui/label.tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  readonly className?: string
}

const DEFAULT_LABEL_CLASSES = "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" as const

const Label = React.memo(
  React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    LabelProps
  >(({ className, ...props }, ref) => {
    const computedClassName = React.useMemo(() => {
      if (!className) return DEFAULT_LABEL_CLASSES
      return cn(DEFAULT_LABEL_CLASSES, className)
    }, [className])

    return (
      <LabelPrimitive.Root
        ref={ref}
        data-slot="label"
        className={computedClassName}
        {...props}
      />
    )
  })
)

Label.displayName = "Label"

export { Label }