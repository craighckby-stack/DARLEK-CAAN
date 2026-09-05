"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Props for the ContextMenuSubTrigger component.
 * Extends Radix UI's ContextMenuPrimitive.SubTrigger props.
 */
export interface ContextMenuSubTriggerProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> {
  /**
   * If true, applies an inset style to the sub-trigger, typically adding left padding.
   */
  inset?: boolean
}

/**
 * Props for the ContextMenuItem component.
 * Extends Radix UI's ContextMenuPrimitive.Item props.
 */
export interface ContextMenuItemProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Item> {
  /**
   * If true, applies an inset style to the item, typically adding left padding.
   */
  inset?: boolean
  /**
   * Defines the visual variant of the menu item.
   * "default" for standard items, "destructive" for actions like delete.
   */
  variant?: "default" | "destructive"
}

/**
 * Props for the ContextMenuLabel component.
 * Extends Radix UI's ContextMenuPrimitive.Label props.
 */
export interface ContextMenuLabelProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Label> {
  /**
   * If true, applies an inset style to the label, typically adding left padding.
   */
  inset?: boolean
}

/**
 * Props for the ContextMenuShortcut component.
 * Extends standard HTML span element props.
 */
export interface ContextMenuShortcutProps
  extends React.ComponentProps<"span"> {}

// Shared styles for popup content panels (e.g., ContextMenuContent, ContextMenuSubContent)
const POPUP_CONTENT_STYLES = cn(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
  "bg-popover text-popover-foreground",
  // Radix UI animation properties
  "origin-[var(--radix-context-menu-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
)

// Shared styles for interactive list items (e.g., ContextMenuItem, ContextMenuSubTrigger)
const INTERACTIVE_ITEM_STYLES = cn(
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
  "outline-none", // Ensures no default browser outline on focus
  "focus:bg-accent focus:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "data-[inset]:pl-8",
  // Consistent SVG icon styling within interactive items
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
)

/**
 * The root component for a context menu.
 * Provides context for all context menu components.
 */
const ContextMenu = React.memo(
  function ContextMenu(props: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
    return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
  }
)
ContextMenu.displayName = "ContextMenu"

/**
 * The component that triggers the context menu when right-clicked.
 */
const ContextMenuTrigger = React.memo(
  function ContextMenuTrigger(props: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
    return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  }
)
ContextMenuTrigger.displayName = "ContextMenuTrigger"

/**
 * A logical grouping of context menu items.
 */
const ContextMenuGroup = React.memo(
  function ContextMenuGroup(props: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
    return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  }
)
ContextMenuGroup.displayName = "ContextMenuGroup"

/**
 * Renders the context menu content outside of the DOM hierarchy of the trigger.
 */
const ContextMenuPortal = React.memo(
  function ContextMenuPortal(props: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
    return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  }
)
ContextMenuPortal.displayName = "ContextMenuPortal"

/**
 * A sub-menu within a context menu.
 */
const ContextMenuSub = React.memo(
  function ContextMenuSub(props: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
    return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
  }
)
ContextMenuSub.displayName = "ContextMenuSub"

/**
 * A group of context menu radio items.
 */
const ContextMenuRadioGroup = React.memo(
  function ContextMenuRadioGroup(props: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
    return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />
  }
)
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup"

/**
 * A trigger for a sub-menu within the context menu.
 */
const ContextMenuSubTrigger = React.memo(
  function ContextMenuSubTrigger({
    className,
    inset,
    children,
    ...props
  }: ContextMenuSubTriggerProps) {
    return (
      <ContextMenuPrimitive.SubTrigger
        data-slot="context-menu-sub-trigger"
        data-inset={inset}
        className={cn(
          INTERACTIVE_ITEM_STYLES,
          "focus:bg-accent focus:text-accent-foreground",
          "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          className
        )}
        {...props}
      >
        {children}
        <ChevronRightIcon className="ml-auto" />
      </ContextMenuPrimitive.SubTrigger>
    )
  }
)
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

/**
 * The content panel for a sub-menu.
 */
const ContextMenuSubContent = React.memo(
  function ContextMenuSubContent({
    className,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
    return (
      <ContextMenuPrimitive.SubContent
        data-slot="context-menu-sub-content"
        className={cn(POPUP_CONTENT_STYLES, "shadow-lg", className)}
        {...props}
      />
    )
  }
)
ContextMenuSubContent.displayName = "ContextMenuSubContent"

/**
 * The main content panel of the context menu.
 */
const ContextMenuContent = React.memo(
  function ContextMenuContent({
    className,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
    return (
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content
          data-slot="context-menu-content"
          className={cn(
            POPUP_CONTENT_STYLES,
            "max-h-[var(--radix-context-menu-content-available-height)] overflow-x-hidden overflow-y-auto shadow-md",
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Portal>
    )
  }
)
ContextMenuContent.displayName = "ContextMenuContent"

/**
 * An individual item within the context menu.
 */
const ContextMenuItem = React.memo(
  function ContextMenuItem({
    className,
    inset,
    variant = "default",
    ...props
  }: ContextMenuItemProps) {
    return (
      <ContextMenuPrimitive.Item
        data-slot="context-menu-item"
        data-inset={inset}
        data-variant={variant}
        className={cn(
          INTERACTIVE_ITEM_STYLES,
          // Styles for the "destructive" variant
          "data-[variant=destructive]:text-destructive",
          "data-[variant=destructive]:focus:bg-destructive/10",
          "dark:data-[variant=destructive]:focus:bg-destructive/20",
          "data-[variant=destructive]:focus:text-destructive",
          "data-[variant=destructive]:*:[svg]:!text-destructive", // Force SVG color for destructive items
          // Default SVG color for non-destructive items
          "[&_svg:not([class*='text-'])]:text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
ContextMenuItem.displayName = "ContextMenuItem"

/**
 * A checkbox item within the context menu.
 */
const ContextMenuCheckboxItem = React.memo(
  function ContextMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
    return (
      <ContextMenuPrimitive.CheckboxItem
        data-slot="context-menu-checkbox-item"
        className={cn(INTERACTIVE_ITEM_STYLES, "py-1.5 pr-2 pl-8", className)}
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

/**
 * A radio item within the context menu.
 */
const ContextMenuRadioItem = React.memo(
  function ContextMenuRadioItem({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
    return (
      <ContextMenuPrimitive.RadioItem
        data-slot="context-menu-radio-item"
        className={cn(INTERACTIVE_ITEM_STYLES, "py-1.5 pr-2 pl-8", className)}
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

/**
 * A non-interactive label within the context menu.
 */
const ContextMenuLabel = React.memo(
  function ContextMenuLabel({
    className,
    inset,
    ...props
  }: ContextMenuLabelProps) {
    return (
      <ContextMenuPrimitive.Label
        data-slot="context-menu-label"
        data-inset={inset}
        className={cn("text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)}
        {...props}
      />
    )
  }
)
ContextMenuLabel.displayName = "ContextMenuLabel"

/**
 * A visual separator between context menu items or groups.
 */
const ContextMenuSeparator = React.memo(
  function ContextMenuSeparator({
    className,
    ...props
  }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
    return (
      <ContextMenuPrimitive.Separator
        data-slot="context-menu-separator"
        className={cn("bg-border -mx-1 my-1 h-px", className)}
        {...props}
      />
    )
  }
)
ContextMenuSeparator.displayName = "ContextMenuSeparator"

/**
 * A visual indicator for a keyboard shortcut associated with a menu item.
 */
const ContextMenuShortcut = React.memo(
  function ContextMenuShortcut({
    className,
    ...props
  }: ContextMenuShortcutProps) {
    return (
      <span
        data-slot="context-menu-shortcut"
        className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
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