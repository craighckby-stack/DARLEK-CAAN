"use client"

import React, { memo, type JSX } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import type { ToastProps } from "@radix-ui/react-toast"

export interface ToastItem extends ToastProps {
  readonly id: string
  readonly title?: React.ReactNode
  readonly description?: React.ReactNode
  readonly action?: React.ReactNode
}

const ToastItemComponent = memo<ToastItem>(({ title, description, action, ...props }) => (
  <Toast {...props}>
    <div className="grid gap-1">
      {title && <ToastTitle>{title}</ToastTitle>}
      {description && <ToastDescription>{description}</ToastDescription>}
    </div>
    {action}
    <ToastClose />
  </Toast>
))

ToastItemComponent.displayName = "ToastItemComponent"

export const Toaster: React.FC = memo((): JSX.Element => {
  const { toasts } = useToast()
  const len = toasts.length

  const renderedToasts = new Array(len)
  for (let i = 0; i < len; i++) {
    const { id, ...toastProps } = toasts[i]
    renderedToasts[i] = <ToastItemComponent key={id} id={id} {...toastProps} />
  }

  return (
    <ToastProvider>
      {renderedToasts}
      <ToastViewport />
    </ToastProvider>
  )
})

Toaster.displayName = "Toaster"