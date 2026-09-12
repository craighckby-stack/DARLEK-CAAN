"use client"

/**
 * @fileoverview Form component system built on top of React Hook Form and Radix UI primitives.
 * Provides accessible, context-driven form primitives designed for clarity and maintainability.
 */

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// ============================================================================
// Types & Interfaces
// ============================================================================

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  readonly name: TName
}

export type FormItemContextValue = {
  readonly id: string
  readonly formItemId: string
  readonly formDescriptionId: string
  readonly formMessageId: string
}

// ============================================================================
// Contexts
// ============================================================================

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)
const FormItemContext = React.createContext<FormItemContextValue | null>(null)

// ============================================================================
// Core Form Component & Hooks
// ============================================================================

const Form = FormProvider

/**
 * Custom hook to access form field state, IDs, and accessibility metadata.
 * Memoizes string allocations and leverages stable context primitives to minimize re-renders.
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const formContext = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField must be used within a <FormField> component.")
  }

  if (!itemContext) {
    throw new Error("useFormField must be used within a <FormItem> component.")
  }

  if (!formContext) {
    throw new Error("useFormField must be used within a FormProvider/Form component.")
  }

  const { getFieldState } = formContext
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)
  const { id, formItemId, formDescriptionId, formMessageId } = itemContext
  const { name } = fieldContext

  return React.useMemo(
    () => ({
      id,
      name,
      formItemId,
      formDescriptionId,
      formMessageId,
      ...fieldState,
    }),
    [id, name, formItemId, formDescriptionId, formMessageId, fieldState]
  )
}

// ============================================================================
// Form Sub-Components
// ============================================================================

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  const fieldContextValue = React.useMemo<FormFieldContextValue<TFieldValues, TName>>(
    () => ({ name }),
    [name]
  )

  return (
    <FormFieldContext.Provider value={fieldContextValue}>
      <Controller name={name} {...props} />
    </FormFieldContext.Provider>
  )
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()
  const itemContextValue = React.useMemo<FormItemContextValue>(
    () => ({
      id,
      formItemId: `${id}-form-item`,
      formDescriptionId: `${id}-form-item-description`,
      formMessageId: `${id}-form-item-message`,
    }),
    [id]
  )

  return (
    <FormItemContext.Provider value={itemContextValue}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()
  const hasError = Boolean(error)

  return (
    <Label
      data-slot="form-label"
      data-error={hasError}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  const hasError = Boolean(error)

  const ariaDescribedBy = React.useMemo(
    () => (!hasError ? formDescriptionId : `${formDescriptionId} ${formMessageId}`),
    [hasError, formDescriptionId, formMessageId]
  )

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={ariaDescribedBy}
      aria-invalid={hasError}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  
  const messageBody = React.useMemo(
    () => (error ? String(error?.message ?? "") : children),
    [error, children]
  )

  if (!messageBody) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {messageBody}
    </p>
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}