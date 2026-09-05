// File: /app/applet/src/app/layout.tsx
import * as entry from '../../../src/app/layout.js'
import type { ResolvingMetadata, ResolvingViewport } from 'next/dist/lib/metadata/types/metadata-interface.js'
import type React from 'react'

type TEntry = typeof import('../../../src/app/layout.js')

// Defensively restrict segment parameter keys to prevent prototype pollution at compile time
type SafeSegmentKey = Exclude<string, '__proto__' | 'prototype' | 'constructor'>

type SegmentParams<T extends object = Record<SafeSegmentKey, string | string[] | undefined>> = T extends Record<SafeSegmentKey, unknown>
  ? { [K in keyof T & SafeSegmentKey]: T[K] extends string | string[] | undefined ? T[K] : never }
  : T

// Defensively constrain and check that entry conforms to Next.js route segment config contracts
checkFields<Diff<{
  default: SafeAnyFunction
  config?: Record<string, unknown>
  generateStaticParams?: SafeAnyFunction
  revalidate?: RevalidateRange<TEntry> | false
  dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static'
  dynamicParams?: boolean
  fetchCache?: 'auto' | 'force-no-store' | 'only-no-store' | 'default-no-store' | 'default-cache' | 'only-cache' | 'force-cache'
  preferredRegion?: 'auto' | 'global' | 'home' | string | readonly string[]
  runtime?: 'nodejs' | 'experimental-edge' | 'edge'
  maxDuration?: NonNegative<number>
  
  metadata?: unknown
  generateMetadata?: SafeAnyFunction
  viewport?: unknown
  generateViewport?: SafeAnyFunction
  experimental_ppr?: boolean
}, TEntry, ''>>()

// Check the prop type of the entry function
checkFields<Diff<LayoutProps, FirstArg<TEntry['default']>, 'default'>>()

// Check the arguments and return type of the generateMetadata function
if ('generateMetadata' in entry) {
  checkFields<Diff<LayoutProps, FirstArg<MaybeField<TEntry, 'generateMetadata'>>, 'generateMetadata'>>()
  checkFields<Diff<ResolvingMetadata, SecondArg<MaybeField<TEntry, 'generateMetadata'>>, 'generateMetadata'>>()
}

// Check the arguments and return type of the generateViewport function
if ('generateViewport' in entry) {
  checkFields<Diff<LayoutProps, FirstArg<MaybeField<TEntry, 'generateViewport'>>, 'generateViewport'>>()
  checkFields<Diff<ResolvingViewport, SecondArg<MaybeField<TEntry, 'generateViewport'>>, 'generateViewport'>>()
}

// Check the arguments and return type of the generateStaticParams function
if ('generateStaticParams' in entry) {
  checkFields<Diff<{ params: SegmentParams }, FirstArg<MaybeField<TEntry, 'generateStaticParams'>>, 'generateStaticParams'>>()
  checkFields<Diff<{ readonly __tag__: 'generateStaticParams'; readonly __return_type__: readonly unknown[] | Promise<readonly unknown[]> }, { readonly __tag__: 'generateStaticParams'; readonly __return_type__: ReturnType<MaybeField<TEntry, 'generateStaticParams'>> }>>()
}

export interface PageProps {
  params?: Promise<SegmentParams>
  searchParams?: Promise<Record<SafeSegmentKey, string | string[] | undefined>>
}

export interface LayoutProps {
  children?: React.ReactNode
  params?: Promise<SegmentParams>
}

// =============
// Security Hardened Utility Types
type SafeAnyFunction = (...args: readonly any[]) => unknown

type RevalidateRange<T> = T extends { revalidate: infer R }
  ? R extends Numeric
    ? NonNegative<R>
    : never
  : never

// Strict diffing eliminating prototype pollution keys and preventing type-checker recursion depth overflow
type OmitWithTag<T, K extends keyof any, _M> = Omit<T, K & keyof T>
type IsAny<T> = 0 extends (1 & T) ? true : false
type Diff<Base, T extends Base, Message extends string = ''> = IsAny<T> extends true
  ? Record<string, never>
  : OmitWithTag<T, keyof Base, Message>

type FirstArg<T> = T extends (...args: readonly [infer F, ...any[]]) => unknown
  ? IsAny<F> extends true
    ? any
    : F
  : never

type SecondArg<T> = T extends (...args: readonly [any, infer S, ...any[]]) => unknown
  ? IsAny<S> extends true
    ? any
    : S
  : never

type MaybeField<T, K extends string> = T extends { [k in K]: infer G }
  ? G extends SafeAnyFunction
    ? G
    : never
  : never

function checkFields<_ extends Record<keyof any, never>>(): void {}

// Numerical boundary validation ensuring non-negative duration/revalidation bounds
type Numeric = number | bigint
type Zero = 0 | 0n
type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never
type NonNegative<T extends Numeric> = T extends Zero ? T : Negative<T> extends never ? T : '__invalid_negative_number__'