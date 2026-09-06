"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>
export type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>
export type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>
export type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>

const TABS_ROOT_CLASS = "flex flex-col gap-2"
const TABS_LIST_CLASS = "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]"
const TABS_TRIGGER_CLASS = "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
const TABS_CONTENT_CLASS = "flex-1 outline-none"

const Tabs = React.memo(
  React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Root>,
    TabsProps
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.Root
      ref={ref}
      data-slot="tabs"
      className={className ? `${TABS_ROOT_CLASS} ${className}` : TABS_ROOT_CLASS}
      {...props}
    />
  ))
)
Tabs.displayName = "Tabs"

const TabsList = React.memo(
  React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    TabsListProps
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      data-slot="tabs-list"
      className={className ? cn(TABS_LIST_CLASS, className) : TABS_LIST_CLASS}
      {...props}
    />
  ))
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.memo(
  React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    TabsTriggerProps
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      data-slot="tabs-trigger"
      className={className ? cn(TABS_TRIGGER_CLASS, className) : TABS_TRIGGER_CLASS}
      {...props}
    />
  ))
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.memo(
  React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    TabsContentProps
  >(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      data-slot="tabs-content"
      className={className ? `${TABS_CONTENT_CLASS} ${className}` : TABS_CONTENT_CLASS}
      {...props}
    />
  ))
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }