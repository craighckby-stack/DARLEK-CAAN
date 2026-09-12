import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  maxLength?: number
  onContentLengthExceeded?: (length: number) => void
}

const TEXTAREA_STYLES = [
  "flex field-sizing-content min-h-16 w-full rounded-md border",
  "border-input bg-transparent dark:bg-input/35 px-3 py-2",
  "text-base md:text-sm shadow-xs transition-[color,box-shadow]",
  "placeholder:text-muted-foreground",
  "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ")

const Textarea = React.memo(
  React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    function Textarea({ className, maxLength, onContentLengthExceeded, onChange, ...props }, ref) {
      const mergedClassName = React.useMemo(
        () => cn(TEXTAREA_STYLES, className),
        [className]
      )

      const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value
          if (maxLength !== undefined && value.length > maxLength) {
            onContentLengthExceeded?.(value.length)
          }
          onChange?.(e)
        },
        [maxLength, onContentLengthExceeded, onChange]
      )

      return (
        <textarea
          ref={ref}
          dir="ltr"
          data-slot="textarea"
          maxLength={maxLength}
          className={mergedClassName}
          style={{ unicodeBidi: 'normal', direction: 'ltr', ...(props.style ?? {}) }}
          onChange={handleChange}
          {...props}
        />
      )
    }
  )
)

Textarea.displayName = "Textarea"

export { Textarea }