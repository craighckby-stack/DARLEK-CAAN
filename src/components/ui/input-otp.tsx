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

const UI_TOKENS = {
  container: "flex items-center gap-2 has-disabled:opacity-50",
  input: "disabled:cursor-not-allowed",
  group: "flex items-center",
  slot: [
    "relative flex h-9 w-9 items-center justify-center border-y border-r border-input",
    "text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l",
    "last:rounded-r-md dark:bg-input/30",
    "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px]",
    "data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive",
    "data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40",
    "aria-invalid:border-destructive",
  ].join(" "),
  caretContainer: "pointer-events-none absolute inset-0 flex items-center justify-center",
  caretInner: "animate-caret-blink bg-foreground h-4 w-px duration-1000",
} as const

const InputOTP = React.memo(
  React.forwardRef<React.ElementRef<typeof OTPInput>, InputOTPProps>(
    function InputOTP({ className, containerClassName, ...props }, ref) {
      const resolvedContainerClassName = React.useMemo(
        () => cn(UI_TOKENS.container, containerClassName),
        [containerClassName]
      )
      
      const resolvedClassName = React.useMemo(
        () => cn(UI_TOKENS.input, className),
        [className]
      )

      return (
        <OTPInput
          ref={ref}
          data-slot="input-otp"
          containerClassName={resolvedContainerClassName}
          className={resolvedClassName}
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
      const resolvedClassName = React.useMemo(
        () => cn(UI_TOKENS.group, className),
        [className]
      )

      return (
        <div
          ref={ref}
          data-slot="input-otp-group"
          className={resolvedClassName}
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
      
      if (!context) {
        throw new Error("InputOTPSlot must be used within an InputOTP component.")
      }
      
      const slot = context.slots?.[index]
      const { char: character, hasFakeCaret, isActive } = slot ?? {}

      const resolvedClassName = React.useMemo(
        () => cn(UI_TOKENS.slot, className),
        [className]
      )

      return (
        <div
          ref={ref}
          data-slot="input-otp-slot"
          data-active={isActive}
          className={resolvedClassName}
          {...props}
        >
          {character}
          {hasFakeCaret && (
            <div className={UI_TOKENS.caretContainer}>
              <div className={UI_TOKENS.caretInner} />
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