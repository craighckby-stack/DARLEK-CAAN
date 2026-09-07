"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// --- Component Interfaces ---

/**
 * Props for the main Command component.
 * Extends all native props of the `cmdk` CommandPrimitive.
 */
export type CommandProps = React.ComponentProps<typeof CommandPrimitive>

/**
 * Props for the CommandDialog component, which wraps Command in a Dialog.
 * Extends all native props of the Dialog component.
 */
export interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  /** Optional title for the dialog, used for accessibility. */
  title?: string
  /** Optional description for the dialog, used for accessibility. */
  description?: string
  /** Additional class names to apply to the dialog content. */
  className?: string
  /** Whether to show the close button on the dialog. Defaults to true. */
  showCloseButton?: boolean
}

/**
 * Props for the CommandInput component.
 * Extends all native props of the `cmdk` CommandPrimitive.Input.
 */
export type CommandInputProps = React.ComponentProps<typeof CommandPrimitive.Input>

/**
 * Props for the CommandList component.
 * Extends all native props of the `cmdk` CommandPrimitive.List.
 */
export type CommandListProps = React.ComponentProps<typeof CommandPrimitive.List>

/**
 * Props for the CommandEmpty component.
 * Extends all native props of the `cmdk` CommandPrimitive.Empty.
 */
export type CommandEmptyProps = React.ComponentProps<typeof CommandPrimitive.Empty>

/**
 * Props for the CommandGroup component.
 * Extends all native props of the `cmdk` CommandPrimitive.Group.
 */
export type CommandGroupProps = React.ComponentProps<typeof CommandPrimitive.Group>

/**
 * Props for the CommandSeparator component.
 * Extends all native props of the `cmdk` CommandPrimitive.Separator.
 */
export type CommandSeparatorProps = React.ComponentProps<typeof CommandPrimitive.Separator>

/**
 * Props for the CommandItem component.
 * Extends all native props of the `cmdk` CommandPrimitive.Item.
 */
export type CommandItemProps = React.ComponentProps<typeof CommandPrimitive.Item>

/**
 * Props for the CommandShortcut component.
 * Extends all native props of a standard `<span>` element.
 */
export type CommandShortcutProps = React.ComponentProps<"span">

// --- Component Implementation ---

/**
 * The main Command component, a wrapper around `cmdk`'s CommandPrimitive.
 * Provides base styling for the command palette.
 */
const Command = React.memo(
  React.forwardRef<HTMLDivElement, CommandProps>(function Command(
    { className, ...props },
    ref
  ) {
    return (
      <CommandPrimitive
        ref={ref}
        data-slot="command"
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md",
          "bg-popover text-popover-foreground",
          className
        )}
        {...props}
      />
    )
  })
)
Command.displayName = "Command"

/**
 * A dialog wrapper for the Command component, providing a modal command palette experience.
 */
const CommandDialog = React.memo(function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command
          className={cn(
            // Group heading styles
            "[&_[cmdk-group-heading]]:px-2",
            "[&_[cmdk-group-heading]]:font-medium",
            "[&_[cmdk-group-heading]]:text-muted-foreground",

            // Group styles
            "[&_[cmdk-group]]:px-2",
            "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0",

            // Input wrapper and icon styles
            "[&_[cmdk-input-wrapper]_svg]:h-5",
            "[&_[cmdk-input-wrapper]_svg]:w-5",

            // Input field styles
            "[&_[cmdk-input]]:h-12",

            // Item styles
            "[&_[cmdk-item]]:px-2",
            "[&_[cmdk-item]]:py-3",
            "[&_[cmdk-item]_svg]:h-5",
            "[&_[cmdk-item]_svg]:w-5"
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
})
CommandDialog.displayName = "CommandDialog"

/**
 * The input field for the Command component, including a search icon.
 */
const CommandInput = React.memo(
  React.forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
    { className, ...props },
    ref
  ) {
    return (
      <div
        data-slot="command-input-wrapper"
        className="flex h-12 items-center gap-2 border-b px-3"
      >
        <SearchIcon className="size-4 shrink-0 opacity-50" aria-hidden="true" />
        <CommandPrimitive.Input
          ref={ref}
          data-slot="command-input"
          className={cn(
            "flex h-10 w-full rounded-md bg-transparent py-3 text-sm",
            "outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-muted-foreground",
            className
          )}
          {...props}
        />
      </div>
    )
  })
)
CommandInput.displayName = "CommandInput"

/**
 * The scrollable list container for command items.
 */
const CommandList = React.memo(
  React.forwardRef<HTMLDivElement, CommandListProps>(function CommandList(
    { className, ...props },
    ref
  ) {
    return (
      <CommandPrimitive.List
        ref={ref}
        data-slot="command-list"
        className={cn(
          "max-h-[300px] overflow-y-auto overflow-x-hidden scroll-py-1",
          className
        )}
        {...props}
      />
    )
  })
)
CommandList.displayName = "CommandList"

/**
 * Component displayed when no search results are found.
 */
const CommandEmpty = React.memo(
  React.forwardRef<HTMLDivElement, CommandEmptyProps>(function CommandEmpty(
    props,
    ref
  ) {
    return (
      <CommandPrimitive.Empty
        ref={ref}
        data-slot="command-empty"
        className="py-6 text-center text-sm"
        {...props}
      />
    )
  })
)
CommandEmpty.displayName = "CommandEmpty"

/**
 * A group of related command items, optionally with a heading.
 */
const CommandGroup = React.memo(
  React.forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup(
    { className, ...props },
    ref
  ) {
    return (
      <CommandPrimitive.Group
        ref={ref}
        data-slot="command-group"
        className={cn(
          "overflow-hidden p-1 text-foreground",
          // Group heading specific styles
          "[&_[cmdk-group-heading]]:px-2",
          "[&_[cmdk-group-heading]]:py-1.5",
          "[&_[cmdk-group-heading]]:text-xs",
          "[&_[cmdk-group-heading]]:font-medium",
          "[&_[cmdk-group-heading]]:text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  })
)
CommandGroup.displayName = "CommandGroup"

/**
 * A visual separator between command groups or items.
 */
const CommandSeparator = React.memo(
  React.forwardRef<HTMLDivElement, CommandSeparatorProps>(function CommandSeparator(
    { className, ...props },
    ref
  ) {
    return (
      <CommandPrimitive.Separator
        ref={ref}
        data-slot="command-separator"
        className={cn("bg-border -mx-1 h-px", className)}
        {...props}
      />
    )
  })
)
CommandSeparator.displayName = "CommandSeparator"

/**
 * An individual selectable item within the command list.
 */
const CommandItem = React.memo(
  React.forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
    { className, ...props },
    ref
  ) {
    return (
      <CommandPrimitive.Item
        ref={ref}
        data-slot="command-item"
        className={cn(
          "relative flex cursor-default select-none items-center gap-2",
          "rounded-sm px-2 py-1.5 text-sm outline-hidden",
          // State-based styling
          "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
          // Icon styling
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",
          "[&_svg:not([class*='text-'])]:text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  })
)
CommandItem.displayName = "CommandItem"

/**
 * A small text element typically used to display keyboard shortcuts.
 */
const CommandShortcut = React.memo(
  React.forwardRef<HTMLSpanElement, CommandShortcutProps>(function CommandShortcut(
    { className, ...props },
    ref
  ) {
    return (
      <span
        ref={ref}
        data-slot="command-shortcut"
        className={cn(
          "ml-auto text-xs tracking-widest text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  })
)
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}