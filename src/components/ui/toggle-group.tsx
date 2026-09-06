"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

export interface ToggleGroupContextValue extends VariantProps<typeof toggleVariants> {}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
})

const useToggleGroupContext = () => React.useContext(ToggleGroupContext)

export interface ToggleGroupProps
  extends React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

const ToggleGroup = React.memo(function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ToggleGroupProps) {
  const contextValue = React.useMemo<ToggleGroupContextValue>(
    () => ({ variant, size }),
    [variant, size]
  )

  const rootClassName = React.useMemo(
    () =>
      cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      ),
    [className]
  )

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={rootClassName}
      {...props}
    >
      <ToggleGroupContext.Provider value={contextValue}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
})
ToggleGroup.displayName = "ToggleGroup"

export interface ToggleGroupItemProps
  extends React.ComponentProps<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {}

const ToggleGroupItem = React.memo(function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  const context = useToggleGroupContext()

  const resolvedVariant = variant ?? context.variant ?? "default"
  const resolvedSize = size ?? context.size ?? "default"

  const itemClassName = React.useMemo(
    () =>
      cn(
        toggleVariants({
          variant: resolvedVariant,
          size: resolvedSize,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      ),
    [resolvedVariant, resolvedSize, className]
  )

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={itemClassName}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }