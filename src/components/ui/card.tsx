import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

export type CardHeaderProps = React.ComponentPropsWithoutRef<"div">
export type CardTitleProps = React.ComponentPropsWithoutRef<"div">
export type CardDescriptionProps = React.ComponentPropsWithoutRef<"div">
export type CardActionProps = React.ComponentPropsWithoutRef<"div">
export type CardContentProps = React.ComponentPropsWithoutRef<"div">
export type CardFooterProps = React.ComponentPropsWithoutRef<"div">

const CARD_BASE_CLASS = "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
const CARD_HEADER_CLASS = "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
const CARD_TITLE_CLASS = "leading-none font-semibold"
const CARD_DESC_CLASS = "text-muted-foreground text-sm"
const CARD_ACTION_CLASS = "col-start-2 row-span-2 row-start-1 self-start justify-self-end"
const CARD_CONTENT_CLASS = "px-6"
const CARD_FOOTER_CLASS = "flex items-center px-6 [.border-t]:pt-6"

const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    function Card({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          data-slot="card"
          className={className ? `${CARD_BASE_CLASS} ${className}` : CARD_BASE_CLASS}
          {...props}
        />
      )
    }
  )
)

const CardHeader = React.memo(
  React.forwardRef<HTMLDivElement, CardHeaderProps>(
    function CardHeader({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          data-slot="card-header"
          className={className ? `${CARD_HEADER_CLASS} ${className}` : CARD_HEADER_CLASS}
          {...props}
        />
      )
    }
  )
)

const CardTitle = React.memo(
  React.forwardRef<HTMLDivElement, CardTitleProps>(
    function CardTitle({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          data-slot="card-title"
          className={className ? `${CARD_TITLE_CLASS} ${className}` : CARD_TITLE_CLASS}
          {...props}
        />
      )
    }
  )
)

const CardDescription = React.memo(
  React.forwardRef<HTMLDivElement, CardDescriptionProps>(
    function CardDescription({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          data-slot="card-description"
          className={className ? `${CARD_DESC_CLASS} ${className}` : CARD_DESC_CLASS}
          {...props}
        />
      )
    }
  )
)

const CardAction = React.memo(
  React.forwardRef<HTMLDivElement, CardActionProps>(
    function CardAction({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          data-slot="card-action"
          className={className ? `${CARD_ACTION_CLASS} ${className}` : CARD_ACTION_CLASS}
          {...props}
        />
      )
    }
  )
)

const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, CardContentProps>(
    function CardContent({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          data-slot="card-content"
          className={className ? `${CARD_CONTENT_CLASS} ${className}` : CARD_CONTENT_CLASS}
          {...props}
        />
      )
    }
  )
)

const CardFooter = React.memo(
  React.forwardRef<HTMLDivElement, CardFooterProps>(
    function CardFooter({ className, ...props }, ref) {
      return (
        <div
          ref={ref}
          data-slot="card-footer"
          className={className ? `${CARD_FOOTER_CLASS} ${className}` : CARD_FOOTER_CLASS}
          {...props}
        />
      )
    }
  )
)

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardDescription.displayName = "CardDescription"
CardAction.displayName = "CardAction"
CardContent.displayName = "CardContent"
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}