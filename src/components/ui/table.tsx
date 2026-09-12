
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TableProps extends React.ComponentProps<"table"> {
  containerClassName?: string
}

/**
 * Higher-order utility to create a memoized, ref-forwarded table primitive component
 * with explicit type safety and runtime allocation.
 */
function createTableComponent<
  TElement extends HTMLElement,
  TProps extends React.ComponentProps<any>
>(
  displayName: string,
  slotName: string,
  baseClassName: string,
  renderElement: (
    props: TProps,
    ref: React.ForwardedRef<TElement>
  ) => React.ReactNode
) {
  const Component = React.memo(
    React.forwardRef<TElement, TProps>((props, ref) => renderElement(props, ref))
  )
  Component.displayName = displayName
  return Component
}

/**
 * Memoized table container and root component.
 */
const Table = createTableComponent<HTMLTableElement, TableProps>(
  "Table",
  "table",
  "w-full caption-bottom text-sm",
  ({ className, containerClassName, ...props }, ref) => (
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
)

/**
 * Memoized table header section component.
 */
const TableHeader = createTableComponent<HTMLTableSectionElement, React.ComponentProps<"thead">>(
  "TableHeader",
  "table-header",
  "[&_tr]:border-b",
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
)

/**
 * Memoized table body section component.
 */
const TableBody = createTableComponent<HTMLTableSectionElement, React.ComponentProps<"tbody">>(
  "TableBody",
  "table-body",
  "[&_tr:last-child]:border-0",
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
)

/**
 * Memoized table footer section component.
 */
const TableFooter = createTableComponent<HTMLTableSectionElement, React.ComponentProps<"tfoot">>(
  "TableFooter",
  "table-footer",
  "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
  ({ className, ...props }, ref) => (
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
)

/**
 * Memoized interactive table row component.
 */
const TableRow = createTableComponent<HTMLTableRowElement, React.ComponentProps<"tr">>(
  "TableRow",
  "table-row",
  "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
  ({ className, ...props }, ref) => (
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
)

/**
 * Memoized table column header cell component.
 */
const TableHead = createTableComponent<HTMLTableCellElement, React.ComponentProps<"th">>(
  "TableHead",
  "table-head",
  "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  ({ className, ...props }, ref) => (
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
)

/**
 * Memoized standard table data cell component.
 */
const TableCell = createTableComponent<HTMLTableCellElement, React.ComponentProps<"td">>(
  "TableCell",
  "table-cell",
  "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  ({ className, ...props }, ref) => (
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
)

/**
 * Memoized descriptive table caption component.
 */
const TableCaption = createTableComponent<HTMLTableCaptionElement, React.ComponentProps<"caption">>(
  "TableCaption",
  "table-caption",
  "text-muted-foreground mt-4 text-sm",
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
)

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