import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ALERT_BASE_CLASSES = [
  "relative",
  "w-full",
  "rounded-lg",
  "border",
  "px-4",
  "py-3",
  "text-sm",
  "grid",
  "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]",
  "grid-cols-[0_1fr]",
  "has-[>svg]:gap-x-3",
  "gap-y-0.5",
  "items-start",
  "[&>svg]:size-4",
  "[&>svg]:translate-y-0.5",
  "[&>svg]:text-current",
].join(" ")

const ALERT_VARIANT_STYLES = {
  default: "bg-card text-card-foreground",
  destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
} as const

const alertVariants = cva(ALERT_BASE_CLASSES, {
  variants: {
    variant: ALERT_VARIANT_STYLES,
  },
  defaultVariants: {
    variant: "default",
  },
})

export type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>
export type AlertTitleProps = React.ComponentProps<"div">
export type AlertDescriptionProps = React.ComponentProps<"div">

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }