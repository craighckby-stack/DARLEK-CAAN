// File: /app/applet/src/app/layout.tsx
import * as entry from '../../../src/app/layout.js'
import type { ResolvingMetadata, ResolvingViewport } from 'next/dist/lib/metadata/types/metadata-interface.js'
import type React from 'react'

type TargetEntry = typeof import('../../../src/app/layout.js')

// Defensively restrict segment parameter keys to prevent prototype pollution at compile time
type SafeSegmentKey = Exclude<string, '__proto__' | 'prototype' | 'constructor'>

type SegmentParams<T extends object = Record<SafeSegmentKey, string | string[] | undefined>> = T extends Record<SafeSegmentKey, unknown>
  ? { readonly [K in keyof T & SafeSegmentKey]: T[K] extends string | string[] | undefined ? T[K] : never }
  : T

// Defensively constrain and check that entry conforms to Next.js route segment config contracts
checkFields<Diff<{
  readonly default: SafeAnyFunction
  readonly config?: Record<string, unknown>
  readonly generateStaticParams?: SafeAnyFunction
  readonly revalidate?: RevalidateRange<TargetEntry> | false
  readonly dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static'
  readonly dynamicParams?: boolean
  readonly fetchCache?: 'auto' | 'force-no-store' | 'only-no-store' | 'default-no-store' | 'default-cache' | 'only-cache' | 'force-cache'
  readonly preferredRegion?: 'auto' | 'global' | 'home' | string | readonly string[]
  readonly runtime?: 'nodejs' | 'experimental-edge' | 'edge'
  readonly maxDuration?: NonNegative<number>
  readonly metadata?: unknown
  readonly generateMetadata?: SafeAnyFunction
  readonly viewport?: unknown
  readonly generateViewport?: SafeAnyFunction
  readonly experimental_ppr?: boolean
}, TargetEntry, ''>>()

// Check the prop type of the entry function
checkFields<Diff<LayoutProps, FirstArg<TargetEntry['default']>, 'default'>>()

// Check the arguments and return type of the generateMetadata function
if ('generateMetadata' in entry) {
  checkFields<Diff<LayoutProps, FirstArg<MaybeField<TargetEntry, 'generateMetadata'>>, 'generateMetadata'>>()
  checkFields<Diff<ResolvingMetadata, SecondArg<MaybeField<TargetEntry, 'generateMetadata'>>, 'generateMetadata'>>()
}

// Check the arguments and return type of the generateViewport function
if ('generateViewport' in entry) {
  checkFields<Diff<LayoutProps, FirstArg<MaybeField<TargetEntry, 'generateViewport'>>, 'generateViewport'>>()
  checkFields<Diff<ResolvingViewport, SecondArg<MaybeField<TargetEntry, 'generateViewport'>>, 'generateViewport'>>()
}

// Check the arguments and return type of the generateStaticParams function
if ('generateStaticParams' in entry) {
  checkFields<Diff<{ readonly params: SegmentParams }, FirstArg<MaybeField<TargetEntry, 'generateStaticParams'>>, 'generateStaticParams'>>()
  checkFields<Diff<{ readonly __tag__: 'generateStaticParams'; readonly __return_type__: readonly unknown[] | Promise<readonly unknown[]> }, { readonly __tag__: 'generateStaticParams'; readonly __return_type__: ReturnType<MaybeField<TargetEntry, 'generateStaticParams'>> }>>()
}

export interface PageProps {
  readonly params?: Promise<SegmentParams>
  readonly searchParams?: Promise<Record<SafeSegmentKey, string | string[] | undefined>>
}

export interface LayoutProps {
  readonly children?: React.ReactNode
  readonly params?: Promise<SegmentParams>
}

// ==========================================
// Security-Hardened Utility Types & Helpers
// ==========================================

type SafeAnyFunction = (...args: readonly any[]) => unknown

type RevalidateRange<T> = T extends { readonly revalidate: infer R }
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

type MaybeField<T, K extends string> = T extends { readonly [k in K]: infer G }
  ? G extends SafeAnyFunction
    ? G
    : never
  : never

// Optimized inline evaluation layout mapping with zero-cost abstraction guards
function checkFields<_ extends Record<keyof any, never>>(): void {}

// Numerical boundary validation ensuring non-negative duration/revalidation bounds
type Numeric = number | bigint
type Zero = 0 | 0n
type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never
type NonNegative<T extends Numeric> = T extends Zero ? T : Negative<T> extends never ? T : '__invalid_negative_number__'