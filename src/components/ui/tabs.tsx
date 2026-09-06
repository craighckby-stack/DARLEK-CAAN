"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>
export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>
export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>
export type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>

const STYLES = {
  root: "flex flex-col gap-2",
  list: "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
  trigger: "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  content: "flex-1 outline-none",
} as const

const Tabs = React.memo(
  React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
    ({ className, ...props }, ref) => (
      <TabsPrimitive.Root
        ref={ref}
        data-slot="tabs"
        className={cn(STYLES.root, className)}
        {...props}
      />
    )
  )
)
Tabs.displayName = "Tabs"

const TabsList = React.memo(
  React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
    ({ className, ...props }, ref) => (
      <TabsPrimitive.List
        ref={ref}
        data-slot="tabs-list"
        className={cn(STYLES.list, className)}
        {...props}
      />
    )
  )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.memo(
  React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
    ({ className, ...props }, ref) => (
      <TabsPrimitive.Trigger
        ref={ref}
        data-slot="tabs-trigger"
        className={cn(STYLES.trigger, className)}
        {...props}
      />
    )
  )
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.memo(
  React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
    ({ className, ...props }, ref) => (
      <TabsPrimitive.Content
        ref={ref}
        data-slot="tabs-content"
        className={cn(STYLES.content, className)}
        {...props}
      />
    )
  )
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }