
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type RadioGroupProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>

export type RadioGroupItemProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>

const RADIO_GROUP_ROOT_STYLES = "grid gap-3"

const RADIO_GROUP_ITEM_STYLES = cn(
  "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  "dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs",
  "transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

const RADIO_GROUP_INDICATOR_STYLES = "relative flex items-center justify-center"

const RADIO_GROUP_ICON_STYLES = "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  const computedClassName = React.useMemo(
    () => (className ? cn(RADIO_GROUP_ROOT_STYLES, className) : RADIO_GROUP_ROOT_STYLES),
    [className]
  )

  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      data-slot="radio-group"
      className={computedClassName}
      {...props}
    />
  )
})

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => {
  const computedClassName = React.useMemo(
    () => (className ? cn(RADIO_GROUP_ITEM_STYLES, className) : RADIO_GROUP_ITEM_STYLES),
    [className]
  )

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-slot="radio-group-item"
      className={computedClassName}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={RADIO_GROUP_INDICATOR_STYLES}
      >
        <CircleIcon className={RADIO_GROUP_ICON_STYLES} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }