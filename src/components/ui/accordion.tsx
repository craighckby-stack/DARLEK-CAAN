/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/components/ui/accordion.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */


import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>
export type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>
export type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger>
export type AccordionContentProps = React.ComponentProps<typeof AccordionPrimitive.Content>

const ACCORDION_ITEM_CLASS = "border-b last:border-b-0"
const ACCORDION_TRIGGER_CLASS = "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180"
const CHEVRON_CLASS = "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
const ACCORDION_CONTENT_CLASS = "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
const ACCORDION_INNER_CONTENT_CLASS = "pt-0 pb-4"

const Accordion = React.memo(
  React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Root>,
    AccordionProps
  >((props, ref) => (
    <AccordionPrimitive.Root ref={ref} data-slot="accordion" {...props} />
  ))
)
Accordion.displayName = "Accordion"

const AccordionItem = React.memo(
  React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    AccordionItemProps
  >(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
      ref={ref}
      data-slot="accordion-item"
      className={className ? `${ACCORDION_ITEM_CLASS} ${className}` : ACCORDION_ITEM_CLASS}
      {...props}
    />
  ))
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.memo(
  React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    AccordionTriggerProps
  >(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        data-slot="accordion-trigger"
        className={className ? `${ACCORDION_TRIGGER_CLASS} ${className}` : ACCORDION_TRIGGER_CLASS}
        {...props}
      >
        {children}
        <ChevronDownIcon className={CHEVRON_CLASS} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  ))
)
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.memo(
  React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    AccordionContentProps
  >(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      data-slot="accordion-content"
      className={ACCORDION_CONTENT_CLASS}
      {...props}
    >
      <div className={className ? `${ACCORDION_INNER_CONTENT_CLASS} ${className}` : ACCORDION_INNER_CONTENT_CLASS}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  ))
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }