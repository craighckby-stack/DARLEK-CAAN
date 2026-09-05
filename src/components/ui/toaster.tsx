"use client"

import React, { memo } from "react"
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

export const Toaster: React.FC = memo(() => {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, ...toastProps }) => (
        <ToastItemComponent key={id} id={id} {...toastProps} />
      ))}
      <ToastViewport />
    </ToastProvider>
  )
})

Toaster.displayName = "Toaster"