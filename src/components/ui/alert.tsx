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
].join(" ") as const

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
}) as const

export type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>
export type AlertTitleProps = React.ComponentProps<"div">
export type AlertDescriptionProps = React.ComponentProps<"div">

const ALERT_TITLE_CLASSES = "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight" as const
const ALERT_DESC_CLASSES = "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed" as const

const Alert = React.memo(
  React.forwardRef<HTMLDivElement, AlertProps>(function Alert({ className, variant, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="alert"
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    )
  })
)
Alert.displayName = "Alert"

const AlertTitle = React.memo(
  React.forwardRef<HTMLDivElement, AlertTitleProps>(function AlertTitle({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="alert-title"
        className={cn(ALERT_TITLE_CLASSES, className)}
        {...props}
      />
    )
  })
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.memo(
  React.forwardRef<HTMLDivElement, AlertDescriptionProps>(function AlertDescription({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="alert-description"
        className={cn(ALERT_DESC_CLASSES, className)}
        {...props}
      />
    )
  })
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, alertVariants }