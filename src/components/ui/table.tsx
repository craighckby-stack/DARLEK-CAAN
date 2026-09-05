"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TableProps extends React.ComponentProps<"table"> {
  containerClassName?: string
}

/**
 * Creates a memoized table component wrapped in a responsive container.
 */
const Table = React.memo(
  React.forwardRef<HTMLTableElement, TableProps>(
    function Table({ className, containerClassName, ...props }, ref) {
      return (
        <div
          data-slot="table-container"
          className={cn("relative w-full overflow-x-auto", containerClassName)}
        >
          <table
            ref={ref}
            data-slot="table"
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
          />
        </div>
      )
    }
  )
)
Table.displayName = "Table"

/**
 * Creates a memoized table header section component.
 */
const TableHeader = React.memo(
  React.forwardRef<HTMLTableSectionElement, React.ComponentProps<"thead">>(
    function TableHeader({ className, ...props }, ref) {
      return (
        <thead
          ref={ref}
          data-slot="table-header"
          className={cn("[&_tr]:border-b", className)}
          {...props}
        />
      )
    }
  )
)
TableHeader.displayName = "TableHeader"

/**
 * Creates a memoized table body section component.
 */
const TableBody = React.memo(
  React.forwardRef<HTMLTableSectionElement, React.ComponentProps<"tbody">>(
    function TableBody({ className, ...props }, ref) {
      return (
        <tbody
          ref={ref}
          data-slot="table-body"
          className={cn("[&_tr:last-child]:border-0", className)}
          {...props}
        />
      )
    }
  )
)
TableBody.displayName = "TableBody"

/**
 * Creates a memoized table footer section component.
 */
const TableFooter = React.memo(
  React.forwardRef<HTMLTableSectionElement, React.ComponentProps<"tfoot">>(
    function TableFooter({ className, ...props }, ref) {
      return (
        <tfoot
          ref={ref}
          data-slot="table-footer"
          className={cn(
            "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
            className
          )}
          {...props}
        />
      )
    }
  )
)
TableFooter.displayName = "TableFooter"

/**
 * Creates a memoized interactive table row component.
 */
const TableRow = React.memo(
  React.forwardRef<HTMLTableRowElement, React.ComponentProps<"tr">>(
    function TableRow({ className, ...props }, ref) {
      return (
        <tr
          ref={ref}
          data-slot="table-row"
          className={cn(
            "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
            className
          )}
          {...props}
        />
      )
    }
  )
)
TableRow.displayName = "TableRow"

/**
 * Creates a memoized table column header cell component.
 */
const TableHead = React.memo(
  React.forwardRef<HTMLTableCellElement, React.ComponentProps<"th">>(
    function TableHead({ className, ...props }, ref) {
      return (
        <th
          ref={ref}
          data-slot="table-head"
          className={cn(
            "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
            className
          )}
          {...props}
        />
      )
    }
  )
)
TableHead.displayName = "TableHead"

/**
 * Creates a memoized standard table data cell component.
 */
const TableCell = React.memo(
  React.forwardRef<HTMLTableCellElement, React.ComponentProps<"td">>(
    function TableCell({ className, ...props }, ref) {
      return (
        <td
          ref={ref}
          data-slot="table-cell"
          className={cn(
            "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
            className
          )}
          {...props}
        />
      )
    }
  )
)
TableCell.displayName = "TableCell"

/**
 * Creates a memoized descriptive table caption component.
 */
const TableCaption = React.memo(
  React.forwardRef<HTMLTableCaptionElement, React.ComponentProps<"caption">>(
    function TableCaption({ className, ...props }, ref) {
      return (
        <caption
          ref={ref}
          data-slot="table-caption"
          className={cn("text-muted-foreground mt-4 text-sm", className)}
          {...props}
        />
      )
    }
  )
)
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}