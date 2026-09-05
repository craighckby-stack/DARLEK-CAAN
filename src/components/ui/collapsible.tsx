"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

export type CollapsibleProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>
export type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>

const CollapsibleRoot = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  CollapsibleProps
>(function CollapsibleRoot(props, ref) {
  return <CollapsiblePrimitive.Root ref={ref} data-slot="collapsible" {...props} />
})
CollapsibleRoot.displayName = "Collapsible"

const CollapsibleTriggerComponent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  CollapsibleTriggerProps
>(function CollapsibleTriggerComponent(props, ref) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      ref={ref}
      data-slot="collapsible-trigger"
      {...props}
    />
  )
})
CollapsibleTriggerComponent.displayName = "CollapsibleTrigger"

const CollapsibleContentComponent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  CollapsibleContentProps
>(function CollapsibleContentComponent(props, ref) {
  return (
    <CollapsiblePrimitive.Content
      ref={ref}
      data-slot="collapsible-content"
      {...props}
    />
  )
})
CollapsibleContentComponent.displayName = "CollapsibleContent"

const Collapsible = React.memo(CollapsibleRoot)
const CollapsibleTrigger = React.memo(CollapsibleTriggerComponent)
const CollapsibleContent = React.memo(CollapsibleContentComponent)

export { Collapsible, CollapsibleTrigger, CollapsibleContent }