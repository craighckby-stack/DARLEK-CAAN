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
    const computedStyle = React.useMemo<React.CSSProperties>(() => {
      const inlineStyles: React.CSSProperties = style ? { ...style } : {}
      
      if (width !== undefined) {
        inlineStyles.width = width
      }
      
      if (height !== undefined) {
        inlineStyles.height = height
      }

      return inlineStyles
    }, [width, height, style])

    const computedClassName = React.useMemo<string>(() => {
      return cn("bg-accent animate-pulse rounded-md", className)
    }, [className])

    return (
      <div
        ref={ref}
        data-slot="skeleton"
        style={computedStyle}
        className={computedClassName}
        {...props}
      />
    )
  }
)

SkeletonComponent.displayName = "Skeleton"

export const Skeleton = React.memo(SkeletonComponent)