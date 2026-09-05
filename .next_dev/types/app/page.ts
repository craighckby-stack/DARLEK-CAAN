// File: /app/applet/src/app/page.tsx
import * as entry from '../../../src/app/page.js'
import type { ResolvingMetadata, ResolvingViewport } from 'next/dist/lib/metadata/types/metadata-interface.js'

type TEntry = typeof import('../../../src/app/page.js')

type SafeKey<K> = K extends '__proto__' | 'prototype' | 'constructor' ? never : K

type SegmentParams<T extends object = Record<string, string | string[] | undefined>> = T extends Record<string, any>
  ? { [K in keyof T as SafeKey<K>]: T[K] extends string ? string | string[] | undefined : T[K] extends string[] ? string[] | undefined : never }
  : T

checkFields<Diff<{
  default: (...args: any[]) => any
  config?: Record<string, unknown>
  generateStaticParams?: (...args: any[]) => any
  revalidate?: RevalidateRange<TEntry> | false
  dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static'
  dynamicParams?: boolean
  fetchCache?: 'auto' | 'force-no-store' | 'only-no-store' | 'default-no-store' | 'default-cache' | 'only-cache' | 'force-cache'
  preferredRegion?: 'auto' | 'global' | 'home' | string | string[]
  runtime?: 'nodejs' | 'experimental-edge' | 'edge'
  maxDuration?: number
  metadata?: any
  generateMetadata?: (...args: any[]) => any
  viewport?: any
  generateViewport?: (...args: any[]) => any
  experimental_ppr?: boolean
}, TEntry, ''>>()

checkFields<Diff<PageProps, FirstArg<TEntry['default']>, 'default'>>()

if ('generateMetadata' in entry) {
  checkFields<Diff<PageProps, FirstArg<MaybeField<TEntry, 'generateMetadata'>>, 'generateMetadata'>>()
  checkFields<Diff<ResolvingMetadata, SecondArg<MaybeField<TEntry, 'generateMetadata'>>, 'generateMetadata'>>()
}

if ('generateViewport' in entry) {
  checkFields<Diff<PageProps, FirstArg<MaybeField<TEntry, 'generateViewport'>>, 'generateViewport'>>()
  checkFields<Diff<ResolvingViewport, SecondArg<MaybeField<TEntry, 'generateViewport'>>, 'generateViewport'>>()
}

if ('generateStaticParams' in entry) {
  checkFields<Diff<{ params: SegmentParams }, FirstArg<MaybeField<TEntry, 'generateStaticParams'>>, 'generateStaticParams'>>()
  checkFields<Diff<{ __tag__: 'generateStaticParams', __return_type__: any[] | Promise<any[]> }, { __tag__: 'generateStaticParams', __return_type__: ReturnType<MaybeField<TEntry, 'generateStaticParams'>> }>>()
}

export interface PageProps {
  params?: Promise<SegmentParams>
  searchParams?: Promise<any>
}

export interface LayoutProps {
  children?: React.ReactNode
  params?: Promise<SegmentParams>
}

type RevalidateRange<T> = T extends { revalidate: any } ? NonNegative<T['revalidate']> : never

type OmitWithTag<T, K extends keyof any, _M> = Omit<T, K & keyof T>
type Diff<Base, T extends Base, Message extends string = ''> = 0 extends (1 & T) ? {} : OmitWithTag<T, keyof Base, Message>

type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any
  ? unknown extends F ? any : F
  : never

type SecondArg<T> = T extends (first: any, second: infer S, ...rest: any[]) => any
  ? unknown extends S ? any : S
  : never

type MaybeField<T, K extends string> = T extends { [P in K]?: infer G }
  ? [G] extends [(...args: any[]) => any]
    ? G
    : never
  : never

const checkFields = <_ extends { [K in keyof any]: never }>(..._args: unknown[]): void => {}

type Numeric = number | bigint
type Zero = 0 | 0n
type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never
type NonNegative<T extends Numeric> = T extends Zero ? T : Negative<T> extends never ? (number extends T ? T : T) : '__invalid_negative_number__'