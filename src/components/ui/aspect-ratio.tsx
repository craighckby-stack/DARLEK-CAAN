/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/components/ui/aspect-ratio.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */


import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import type { ComponentPropsWithoutRef, ElementRef, ReactElement } from "react"
import { forwardRef } from "react"

export type AspectRatioProps = ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
export type AspectRatioElement = ElementRef<typeof AspectRatioPrimitive.Root>

export const AspectRatio: React.ForwardRefExoticComponent<
  AspectRatioProps & React.RefAttributes<AspectRatioElement>
> = forwardRef<AspectRatioElement, AspectRatioProps>(
  function AspectRatio(props, ref): ReactElement {
    return <AspectRatioPrimitive.Root ref={ref} data-slot="aspect-ratio" {...props} />
  }
)

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }