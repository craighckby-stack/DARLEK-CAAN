/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/components/ui/dialog.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */


import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>
export type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>
export type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>
export type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>
export type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>
export type DialogHeaderProps = React.ComponentProps<"div">
export type DialogFooterProps = React.ComponentProps<"div">
export type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>
export type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean
}

const OVERLAY_CLASSES = "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
const CONTENT_CLASSES = "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
const CLOSE_BUTTON_CLASSES = "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
const HEADER_CLASSES = "flex flex-col gap-2 text-center sm:text-left"
const FOOTER_CLASSES = "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
const TITLE_CLASSES = "text-lg leading-none font-semibold"
const DESCRIPTION_CLASSES = "text-muted-foreground text-sm"

const Dialog = React.memo(
  function Dialog(props: DialogProps) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />
  }
)
Dialog.displayName = "Dialog"

const DialogTrigger = React.memo(
  function DialogTrigger(props: DialogTriggerProps) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
  }
)
DialogTrigger.displayName = "DialogTrigger"

const DialogPortal = React.memo(
  function DialogPortal(props: DialogPortalProps) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
  }
)
DialogPortal.displayName = "DialogPortal"

const DialogClose = React.memo(
  function DialogClose(props: DialogCloseProps) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
  }
)
DialogClose.displayName = "DialogClose"

const DialogOverlay = React.memo(
  function DialogOverlay({ className, ...props }: DialogOverlayProps) {
    return (
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className={className ? cn(OVERLAY_CLASSES, className) : OVERLAY_CLASSES}
        {...props}
      />
    )
  }
)
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.memo(
  function DialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
  }: DialogContentProps) {
    return (
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={className ? cn(CONTENT_CLASSES, className) : CONTENT_CLASSES}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              className={CLOSE_BUTTON_CLASSES}
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = React.memo(
  function DialogHeader({ className, ...props }: DialogHeaderProps) {
    return (
      <div
        data-slot="dialog-header"
        className={className ? cn(HEADER_CLASSES, className) : HEADER_CLASSES}
        {...props}
      />
    )
  }
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = React.memo(
  function DialogFooter({ className, ...props }: DialogFooterProps) {
    return (
      <div
        data-slot="dialog-footer"
        className={className ? cn(FOOTER_CLASSES, className) : FOOTER_CLASSES}
        {...props}
      />
    )
  }
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.memo(
  function DialogTitle({ className, ...props }: DialogTitleProps) {
    return (
      <DialogPrimitive.Title
        data-slot="dialog-title"
        className={className ? cn(TITLE_CLASSES, className) : TITLE_CLASSES}
        {...props}
      />
    )
  }
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.memo(
  function DialogDescription({ className, ...props }: DialogDescriptionProps) {
    return (
      <DialogPrimitive.Description
        data-slot="dialog-description"
        className={className ? cn(DESCRIPTION_CLASSES, className) : DESCRIPTION_CLASSES}
        {...props}
      />
    )
  }
)
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}