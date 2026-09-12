
import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>

const SWITCH_TRACK_STYLES = cn(
  "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs",
  "transition-all outline-none cursor-pointer",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  "dark:data-[state=unchecked]:bg-input/80"
)

const SWITCH_THUMB_STYLES = cn(
  "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
  "bg-background shadow-xs",
  "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
  "dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground"
)

const Switch = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    SwitchProps
  >(({ className, ...props }, ref) => {
    const rootClassName = React.useMemo(
      () => cn(SWITCH_TRACK_STYLES, className),
      [className]
    )

    return (
      <SwitchPrimitive.Root
        ref={ref}
        data-slot="switch"
        className={rootClassName}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={SWITCH_THUMB_STYLES}
        />
      </SwitchPrimitive.Root>
    )
  })
)

Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }