import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.ComponentProps<"div"> {
  /** Optional custom width to override default styling */
  width?: string | number
  /** Optional custom height to override default styling */
  height?: string | number
}

const SkeletonComponent = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, style, width, height, ...props }, ref) => {
    const computedStyle = React.useMemo<React.CSSProperties>(
      () => ({
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...style,
      }),
      [width, height, style]
    )

    return (
      <div
        ref={ref}
        data-slot="skeleton"
        style={computedStyle}
        className={cn("bg-accent animate-pulse rounded-md", className)}
        {...props}
      />
    )
  }
)

SkeletonComponent.displayName = "Skeleton"

export const Skeleton = React.memo(SkeletonComponent)