"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputOTPProps extends React.ComponentProps<typeof OTPInput> {
  containerClassName?: string
}

export interface InputOTPSlotProps extends React.ComponentProps<"div"> {
  index: number
}

// Pre-allocate static class strings to prevent dynamic template literal allocations on every render cycle.
const CONTAINER_BASE_CLASS = "flex items-center gap-2 has-disabled:opacity-50"
const INPUT_BASE_CLASS = "disabled:cursor-not-allowed"
const GROUP_BASE_CLASS = "flex items-center"
const SLOT_BASE_CLASS = "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]"
const CARET_CONTAINER_CLASS = "pointer-events-none absolute inset-0 flex items-center justify-center"
const CARET_INNER_CLASS = "animate-caret-blink bg-foreground h-4 w-px duration-1000"

const InputOTP = React.memo(
  React.forwardRef<React.ElementRef<typeof OTPInput>, InputOTPProps>(
    function InputOTP({ className, containerClassName, ...props }, ref) {
      const memoizedContainerClassName = React.useMemo(
        () => cn(CONTAINER_BASE_CLASS, containerClassName),
        [containerClassName]
      )
      const memoizedClassName = React.useMemo(
        () => cn(INPUT_BASE_CLASS, className),
        [className]
      )

      return (
        <OTPInput
          ref={ref}
          data-slot="input-otp"
          containerClassName={memoizedContainerClassName}
          className={memoizedClassName}
          {...props}
        />
      )
    }
  )
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.memo(
  React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    function InputOTPGroup({ className, ...props }, ref) {
      const memoizedClassName = React.useMemo(
        () => cn(GROUP_BASE_CLASS, className),
        [className]
      )

      return (
        <div
          ref={ref}
          data-slot="input-otp-group"
          className={memoizedClassName}
          {...props}
        />
      )
    }
  )
)
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.memo(
  React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
    function InputOTPSlot({ index, className, ...props }, ref) {
      const context = React.useContext(OTPInputContext)
      const slot = context?.slots?.[index]
      
      const character = slot?.char
      const hasFakeCaret = slot?.hasFakeCaret
      const isActive = slot?.isActive

      const memoizedClassName = React.useMemo(
        () => cn(SLOT_BASE_CLASS, className),
        [className]
      )

      return (
        <div
          ref={ref}
          data-slot="input-otp-slot"
          data-active={isActive}
          className={memoizedClassName}
          {...props}
        >
          {character}
          {hasFakeCaret && (
            <div className={CARET_CONTAINER_CLASS}>
              <div className={CARET_INNER_CLASS} />
            </div>
          )}
        </div>
      )
    }
  )
)
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.memo(
  React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    function InputOTPSeparator(props, ref) {
      return (
        <div ref={ref} data-slot="input-otp-separator" role="separator" {...props}>
          <MinusIcon />
        </div>
      )
    }
  )
)
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }