/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/components/ui/context-menu.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ContextMenuSubTriggerProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> {
  inset?: boolean
}

export interface ContextMenuItemProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Item> {
  inset?: boolean
  variant?: "default" | "destructive"
}

export interface ContextMenuLabelProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Label> {
  inset?: boolean
}

export interface ContextMenuShortcutProps
  extends React.ComponentProps<"span"> {}

const POPUP_CONTENT_STYLES = cn(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
  "bg-popover text-popover-foreground",
  "origin-[var(--radix-context-menu-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
)

const INTERACTIVE_ITEM_STYLES = cn(
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
  "outline-none",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "data-[inset]:pl-8",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
)

const ContextMenu = React.memo(
  function ContextMenu(props: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
    return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
  }
)
ContextMenu.displayName = "ContextMenu"

const ContextMenuTrigger = React.memo(
  function ContextMenuTrigger(props: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
    return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  }
)
ContextMenuTrigger.displayName = "ContextMenuTrigger"

const ContextMenuGroup = React.memo(
  function ContextMenuGroup(props: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
    return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  }
)
ContextMenuGroup.displayName = "ContextMenuGroup"

const ContextMenuPortal = React.memo(
  function ContextMenuPortal(props: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
    return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  }
)
ContextMenuPortal.displayName = "ContextMenuPortal"

const ContextMenuSub = React.memo(
  function ContextMenuSub(props: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
    return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
  }
)
ContextMenuSub.displayName = "ContextMenuSub"

const ContextMenuRadioGroup = React.memo(
  function ContextMenuRadioGroup(props: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
    return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />
  }
)
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup"

const ContextMenuSubTrigger = React.memo(
  function ContextMenuSubTrigger({
    className,
    inset,
    children,
    ...props
  }: ContextMenuSubTriggerProps) {
    const computedClassName = React.useMemo(
      () =>
        cn(
          INTERACTIVE_ITEM_STYLES,
          "focus:bg-accent focus:text-accent-foreground",
          "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          className
        ),
      [className]
    )

    return (
      <ContextMenuPrimitive.SubTrigger
        data-slot="context-menu-sub-trigger"
        data-inset={inset}
        className={computedClassName}
        {...props}
      >
        {children}
        <ChevronRightIcon className="ml-auto" />
      </ContextMenuPrimitive.SubTrigger>
    )
  }
)
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

const ContextMenuSubContent = React.memo(
  function ContextMenuSubContent({
    className,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
    const computedClassName = React.useMemo(
      () => cn(POPUP_CONTENT_STYLES, "shadow-lg", className),
      [className]
    )

    return (
      <ContextMenuPrimitive.SubContent
        data-slot="context-menu-sub-content"
        className={computedClassName}
        {...props}
      />
    )
  }
)
ContextMenuSubContent.displayName = "ContextMenuSubContent"

const ContextMenuContent = React.memo(
  function ContextMenuContent({
    className,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
    const computedClassName = React.useMemo(
      () =>
        cn(
          POPUP_CONTENT_STYLES,
          "max-h-[var(--radix-context-menu-content-available-height)] overflow-x-hidden overflow-y-auto shadow-md",
          className
        ),
      [className]
    )

    return (
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content
          data-slot="context-menu-content"
          className={computedClassName}
          {...props}
        />
      </ContextMenuPrimitive.Portal>
    )
  }
)
ContextMenuContent.displayName = "ContextMenuContent"

const ContextMenuItem = React.memo(
  function ContextMenuItem({
    className,
    inset,
    variant = "default",
    ...props
  }: ContextMenuItemProps) {
    const computedClassName = React.useMemo(
      () =>
        cn(
          INTERACTIVE_ITEM_STYLES,
          "data-[variant=destructive]:text-destructive",
          "data-[variant=destructive]:focus:bg-destructive/10",
          "dark:data-[variant=destructive]:focus:bg-destructive/20",
          "data-[variant=destructive]:focus:text-destructive",
          "data-[variant=destructive]:*:[svg]:!text-destructive",
          "[&_svg:not([class*='text-'])]:text-muted-foreground",
          className
        ),
      [className]
    )

    return (
      <ContextMenuPrimitive.Item
        data-slot="context-menu-item"
        data-inset={inset}
        data-variant={variant}
        className={computedClassName}
        {...props}
      />
    )
  }
)
ContextMenuItem.displayName = "ContextMenuItem"

const ContextMenuCheckboxItem = React.memo(
  function ContextMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
    const computedClassName = React.useMemo(
      () => cn(INTERACTIVE_ITEM_STYLES, "py-1.5 pr-2 pl-8", className),
      [className]
    )

    return (
      <ContextMenuPrimitive.CheckboxItem
        data-slot="context-menu-checkbox-item"
        className={computedClassName}
        checked={checked}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <ContextMenuPrimitive.ItemIndicator>
            <CheckIcon className="size-4" />
          </ContextMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </ContextMenuPrimitive.CheckboxItem>
    )
  }
)
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

const ContextMenuRadioItem = React.memo(
  function ContextMenuRadioItem({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
    const computedClassName = React.useMemo(
      () => cn(INTERACTIVE_ITEM_STYLES, "py-1.5 pr-2 pl-8", className),
      [className]
    )

    return (
      <ContextMenuPrimitive.RadioItem
        data-slot="context-menu-radio-item"
        className={computedClassName}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <ContextMenuPrimitive.ItemIndicator>
            <CircleIcon className="size-2 fill-current" />
          </ContextMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </ContextMenuPrimitive.RadioItem>
    )
  }
)
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"

const ContextMenuLabel = React.memo(
  function ContextMenuLabel({
    className,
    inset,
    ...props
  }: ContextMenuLabelProps) {
    const computedClassName = React.useMemo(
      () => cn("text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className),
      [className]
    )

    return (
      <ContextMenuPrimitive.Label
        data-slot="context-menu-label"
        data-inset={inset}
        className={computedClassName}
        {...props}
      />
    )
  }
)
ContextMenuLabel.displayName = "ContextMenuLabel"

const ContextMenuSeparator = React.memo(
  function ContextMenuSeparator({
    className,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
    const computedClassName = React.useMemo(
      () => cn("bg-border -mx-1 my-1 h-px", className),
      [className]
    )

    return (
      <ContextMenuPrimitive.Separator
        data-slot="context-menu-separator"
        className={computedClassName}
        {...props}
      />
    )
  }
)
ContextMenuSeparator.displayName = "ContextMenuSeparator"

const ContextMenuShortcut = React.memo(
  function ContextMenuShortcut({
    className,
    ...props
  }: ContextMenuShortcutProps) {
    const computedClassName = React.useMemo(
      () => cn("text-muted-foreground ml-auto text-xs tracking-widest", className),
      [className]
    )

    return (
      <span
        data-slot="context-menu-shortcut"
        className={computedClassName}
        {...props}
      />
    )
  }
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}