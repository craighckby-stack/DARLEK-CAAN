import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"

export interface PaginationProps extends React.ComponentProps<"nav"> {}

const Pagination = React.memo(
  React.forwardRef<HTMLElement, PaginationProps>(
    ({ className, ...props }, ref) => (
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      />
    )
  )
)
Pagination.displayName = "Pagination"

export interface PaginationContentProps extends React.ComponentProps<"ul"> {}

const PaginationContent = React.memo(
  React.forwardRef<HTMLUListElement, PaginationContentProps>(
    ({ className, ...props }, ref) => (
      <ul
        ref={ref}
        data-slot="pagination-content"
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
      />
    )
  )
)
PaginationContent.displayName = "PaginationContent"

export interface PaginationItemProps extends React.ComponentProps<"li"> {}

const PaginationItem = React.memo(
  React.forwardRef<HTMLLIElement, PaginationItemProps>(
    ({ ...props }, ref) => (
      <li ref={ref} data-slot="pagination-item" {...props} />
    )
  )
)
PaginationItem.displayName = "PaginationItem"

export type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = React.memo(
  React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
    ({ className, isActive, size = "icon", ...props }, ref) => {
      const computedClassName = React.useMemo(() => {
        return cn(
          buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size,
          }),
          className
        )
      }, [isActive, size, className])

      return (
        <a
          ref={ref}
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          className={computedClassName}
          {...props}
        />
      )
    }
  )
)
PaginationLink.displayName = "PaginationLink"

export interface PaginationPreviousProps extends React.ComponentProps<typeof PaginationLink> {}

const PaginationPrevious = React.memo(
  React.forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
    ({ className, ...props }, ref) => {
      const computedClassName = React.useMemo(() => {
        return cn("gap-1 px-2.5 sm:pl-2.5", className)
      }, [className])

      return (
        <PaginationLink
          ref={ref}
          aria-label="Go to previous page"
          size="default"
          className={computedClassName}
          {...props}
        >
          <ChevronLeftIcon />
          <span className="hidden sm:block">Previous</span>
        </PaginationLink>
      )
    }
  )
)
PaginationPrevious.displayName = "PaginationPrevious"

export interface PaginationNextProps extends React.ComponentProps<typeof PaginationLink> {}

const PaginationNext = React.memo(
  React.forwardRef<HTMLAnchorElement, PaginationNextProps>(
    ({ className, ...props }, ref) => {
      const computedClassName = React.useMemo(() => {
        return cn("gap-1 px-2.5 sm:pr-2.5", className)
      }, [className])

      return (
        <PaginationLink
          ref={ref}
          aria-label="Go to next page"
          size="default"
          className={computedClassName}
          {...props}
        >
          <span className="hidden sm:block">Next</span>
          <ChevronRightIcon />
        </PaginationLink>
      )
    }
  )
)
PaginationNext.displayName = "PaginationNext"

export interface PaginationEllipsisProps extends React.ComponentProps<"span"> {}

const PaginationEllipsis = React.memo(
  React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
    ({ className, ...props }, ref) => {
      const computedClassName = React.useMemo(() => {
        return cn("flex size-9 items-center justify-center", className)
      }, [className])

      return (
        <span
          ref={ref}
          aria-hidden
          data-slot="pagination-ellipsis"
          className={computedClassName}
          {...props}
        >
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">More pages</span>
        </span>
      )
    }
  )
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}