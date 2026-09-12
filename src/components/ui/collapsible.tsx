/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/components/ui/collapsible.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */


import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

export type CollapsibleProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>
export type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>

const Collapsible = React.memo(
  React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.Root>,
    CollapsibleProps
  >(function Collapsible(props, ref) {
    return <CollapsiblePrimitive.Root ref={ref} data-slot="collapsible" {...props} />
  })
)
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.memo(
  React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
    CollapsibleTriggerProps
  >(function CollapsibleTrigger(props, ref) {
    return (
      <CollapsiblePrimitive.CollapsibleTrigger
        ref={ref}
        data-slot="collapsible-trigger"
        {...props}
      />
    )
  })
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.memo(
  React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.Content>,
    CollapsibleContentProps
  >(function CollapsibleContent(props, ref) {
    return (
      <CollapsiblePrimitive.Content
        ref={ref}
        data-slot="collapsible-content"
        {...props}
      />
    )
  })
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }