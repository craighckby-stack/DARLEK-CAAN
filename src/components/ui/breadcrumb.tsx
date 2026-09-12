/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/components/ui/breadcrumb.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.ComponentProps<"nav"> {}

const Breadcrumb = React.memo(
  React.forwardRef<HTMLElement, BreadcrumbProps>((props, ref) => (
    <nav ref={ref} aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
  ))
)
Breadcrumb.displayName = "Breadcrumb"

export interface BreadcrumbListProps extends React.ComponentProps<"ol"> {}

const BreadcrumbList = React.memo(
  React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
    ({ className, ...props }, ref) => (
      <ol
        ref={ref}
        data-slot="breadcrumb-list"
        className={cn(
          "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
          className
        )}
        {...props}
      />
    )
  )
)
BreadcrumbList.displayName = "BreadcrumbList"

export interface BreadcrumbItemProps extends React.ComponentProps<"li"> {}

const BreadcrumbItem = React.memo(
  React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
    ({ className, ...props }, ref) => (
      <li
        ref={ref}
        data-slot="breadcrumb-item"
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
      />
    )
  )
)
BreadcrumbItem.displayName = "BreadcrumbItem"

export interface BreadcrumbLinkProps extends React.ComponentProps<"a"> {
  asChild?: boolean
}

const BreadcrumbLink = React.memo(
  React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
    ({ asChild = false, className, ...props }, ref) => {
      const Component = asChild ? Slot : "a"

      return (
        <Component
          ref={ref}
          data-slot="breadcrumb-link"
          className={cn("hover:text-foreground transition-colors", className)}
          {...props}
        />
      )
    }
  )
)
BreadcrumbLink.displayName = "BreadcrumbLink"

export interface BreadcrumbPageProps extends React.ComponentProps<"span"> {}

const BreadcrumbPage = React.memo(
  React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
    ({ className, ...props }, ref) => (
      <span
        ref={ref}
        data-slot="breadcrumb-page"
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn("text-foreground font-normal", className)}
        {...props}
      />
    )
  )
)
BreadcrumbPage.displayName = "BreadcrumbPage"

const cachedChevron = <ChevronRight />

export interface BreadcrumbSeparatorProps extends React.ComponentProps<"li"> {}

const BreadcrumbSeparator = React.memo(
  React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
    ({ children, className, ...props }, ref) => (
      <li
        ref={ref}
        data-slot="breadcrumb-separator"
        role="presentation"
        aria-hidden="true"
        className={cn("[&>svg]:size-3.5", className)}
        {...props}
      >
        {children ?? cachedChevron}
      </li>
    )
  )
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const cachedEllipsisIcon = <MoreHorizontal className="size-4" />
const cachedScreenReaderMore = <span className="sr-only">More</span>

export interface BreadcrumbEllipsisProps extends React.ComponentProps<"span"> {}

const BreadcrumbEllipsis = React.memo(
  React.forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
    ({ className, ...props }, ref) => (
      <span
        ref={ref}
        data-slot="breadcrumb-ellipsis"
        role="presentation"
        aria-hidden="true"
        className={cn("flex size-9 items-center justify-center", className)}
        {...props}
      >
        {cachedEllipsisIcon}
        {cachedScreenReaderMore}
      </span>
    )
  )
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}