
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  readonly size?: "sm" | "default"
}

// Centralized theme styling definitions (immutable via Object.freeze)
const STYLES = Object.freeze({
  trigger: cn(
    "border-input data-[placeholder]:text-muted-foreground",
    "[&_svg:not([class*='text-'])]:text-muted-foreground",
    "focus-visible:border-ring focus-visible:ring-ring/50",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "dark:bg-input/30 dark:hover:bg-input/50",
    "flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs",
    "transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[size=default]:h-9 data-[size=sm]:h-8",
    "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
  ),
  scrollButton: "flex cursor-default items-center justify-center py-1",
  content: cn(
    "bg-popover text-popover-foreground",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin)",
    "overflow-x-hidden overflow-y-auto rounded-md border shadow-md"
  ),
  popperContentOffset: "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
  viewport: "p-1",
  popperViewport: "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
  label: "text-muted-foreground px-2 py-1.5 text-xs",
  item: cn(
    "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground",
    "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
  ),
  itemIndicatorWrapper: "absolute right-2 flex size-3.5 items-center justify-center",
  separator: "bg-border pointer-events-none -mx-1 my-1 h-px",
})

const Select = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Root>,
    React.ComponentProps<typeof SelectPrimitive.Root>
  >(function Select(props, ref) {
    return <SelectPrimitive.Root ref={ref} data-slot="select" {...props} />
  })
)
Select.displayName = "Select"

const SelectGroup = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Group>,
    React.ComponentProps<typeof SelectPrimitive.Group>
  >(function SelectGroup(props, ref) {
    return <SelectPrimitive.Group ref={ref} data-slot="select-group" {...props} />
  })
)
SelectGroup.displayName = "SelectGroup"

const SelectValue = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Value>,
    React.ComponentProps<typeof SelectPrimitive.Value>
  >(function SelectValue(props, ref) {
    return <SelectPrimitive.Value ref={ref} data-slot="select-value" {...props} />
  })
)
SelectValue.displayName = "SelectValue"

const SelectTrigger = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    SelectTriggerProps
  >(function SelectTrigger({ className, size = "default", children, ...props }, ref) {
    const computedClassName = React.useMemo(
      () => cn(STYLES.trigger, className),
      [className]
    )

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        data-slot="select-trigger"
        data-size={size}
        className={computedClassName}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    )
  })
)
SelectTrigger.displayName = "SelectTrigger"

const SelectScrollUpButton = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
  >(function SelectScrollUpButton({ className, ...props }, ref) {
    const computedClassName = React.useMemo(
      () => cn(STYLES.scrollButton, className),
      [className]
    )

    return (
      <SelectPrimitive.ScrollUpButton
        ref={ref}
        data-slot="select-scroll-up-button"
        className={computedClassName}
        {...props}
      >
        <ChevronUpIcon className="size-4" />
      </SelectPrimitive.ScrollUpButton>
    )
  })
)
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>
  >(function SelectScrollDownButton({ className, ...props }, ref) {
    const computedClassName = React.useMemo(
      () => cn(STYLES.scrollButton, className),
      [className]
    )

    return (
      <SelectPrimitive.ScrollDownButton
        ref={ref}
        data-slot="select-scroll-down-button"
        className={computedClassName}
        {...props}
      >
        <ChevronDownIcon className="size-4" />
      </SelectPrimitive.ScrollDownButton>
    )
  })
)
SelectScrollDownButton.displayName = "SelectScrollDownButton"

const SelectContent = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentProps<typeof SelectPrimitive.Content>
  >(function SelectContent({ className, children, position = "popper", ...props }, ref) {
    const isPopper = position === "popper"
    
    const computedClassName = React.useMemo(
      () => cn(STYLES.content, isPopper && STYLES.popperContentOffset, className),
      [isPopper, className]
    )

    const viewportClassName = React.useMemo(
      () => (isPopper ? cn(STYLES.viewport, STYLES.popperViewport) : STYLES.viewport),
      [isPopper]
    )

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          data-slot="select-content"
          className={computedClassName}
          position={position}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport className={viewportClassName}>
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    )
  })
)
SelectContent.displayName = "SelectContent"

const SelectLabel = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentProps<typeof SelectPrimitive.Label>
  >(function SelectLabel({ className, ...props }, ref) {
    const computedClassName = React.useMemo(
      () => cn(STYLES.label, className),
      [className]
    )

    return (
      <SelectPrimitive.Label
        ref={ref}
        data-slot="select-label"
        className={computedClassName}
        {...props}
      />
    )
  })
)
SelectLabel.displayName = "SelectLabel"

const SelectItem = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentProps<typeof SelectPrimitive.Item>
  >(function SelectItem({ className, children, ...props }, ref) {
    const computedClassName = React.useMemo(
      () => cn(STYLES.item, className),
      [className]
    )

    return (
      <SelectPrimitive.Item
        ref={ref}
        data-slot="select-item"
        className={computedClassName}
        {...props}
      >
        <span className={STYLES.itemIndicatorWrapper}>
          <SelectPrimitive.ItemIndicator>
            <CheckIcon className="size-4" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    )
  })
)
SelectItem.displayName = "SelectItem"

const SelectSeparator = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentProps<typeof SelectPrimitive.Separator>
  >(function SelectSeparator({ className, ...props }, ref) {
    const computedClassName = React.useMemo(
      () => cn(STYLES.separator, className),
      [className]
    )

    return (
      <SelectPrimitive.Separator
        ref={ref}
        data-slot="select-separator"
        className={computedClassName}
        {...props}
      />
    )
  })
)
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}