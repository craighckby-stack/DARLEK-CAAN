"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const STYLE_TOKENS = Object.freeze({
  overlay: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
  content: "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border p-6 shadow-2xl duration-200 sm:max-w-lg",
  header: "flex flex-col gap-2 text-center sm:text-left",
  footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  title: "text-lg font-semibold tracking-tight",
  description: "text-muted-foreground text-sm leading-relaxed",
})

export interface AlertDialogProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root> {}
export interface AlertDialogTriggerProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger> {}
export interface AlertDialogPortalProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal> {}
export interface AlertDialogOverlayProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> {}
export interface AlertDialogContentProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {}
export interface AlertDialogHeaderProps extends React.ComponentPropsWithoutRef<"div"> {}
export interface AlertDialogFooterProps extends React.ComponentPropsWithoutRef<"div"> {}
export interface AlertDialogTitleProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> {}
export interface AlertDialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> {}
export interface AlertDialogActionProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {}
export interface AlertDialogCancelProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> {}

const AlertDialog = React.memo<React.FC<AlertDialogProps>>(function AlertDialog(props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
})
AlertDialog.displayName = "AlertDialog"

const AlertDialogTrigger = React.memo<React.FC<AlertDialogTriggerProps>>(function AlertDialogTrigger(props) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
})
AlertDialogTrigger.displayName = "AlertDialogTrigger"

const AlertDialogPortal = React.memo<React.FC<AlertDialogPortalProps>>(function AlertDialogPortal(props) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
})
AlertDialogPortal.displayName = "AlertDialogPortal"

const AlertDialogOverlay = React.memo<React.FC<AlertDialogOverlayProps>>(function AlertDialogOverlay({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(STYLE_TOKENS.overlay, className)}
      {...props}
    />
  )
})
AlertDialogOverlay.displayName = "AlertDialogOverlay"

const AlertDialogContent = React.memo<React.FC<AlertDialogContentProps>>(function AlertDialogContent({
  className,
  ...props
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(STYLE_TOKENS.content, className)}
        {...props}
      />
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = React.memo<React.FC<AlertDialogHeaderProps>>(function AlertDialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(STYLE_TOKENS.header, className)}
      {...props}
    />
  )
})
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = React.memo<React.FC<AlertDialogFooterProps>>(function AlertDialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(STYLE_TOKENS.footer, className)}
      {...props}
    />
  )
})
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.memo<React.FC<AlertDialogTitleProps>>(function AlertDialogTitle({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(STYLE_TOKENS.title, className)}
      {...props}
    />
  )
})
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.memo<React.FC<AlertDialogDescriptionProps>>(function AlertDialogDescription({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(STYLE_TOKENS.description, className)}
      {...props}
    />
  )
})
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.memo<React.FC<AlertDialogActionProps>>(function AlertDialogAction({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
})
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.memo<React.FC<AlertDialogCancelProps>>(function AlertDialogCancel({
  className,
  ...props
}) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}