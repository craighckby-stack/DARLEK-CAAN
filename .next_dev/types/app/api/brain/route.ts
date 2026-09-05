// File: /app/applet/src/app/api/brain/route.ts
import * as entry from '../../../../../src/app/api/brain/route.js'
import type { NextRequest } from 'next/server.js'

type TEntry = typeof import('../../../../../src/app/api/brain/route.js')

type SafeStringKey<T> = Extract<keyof T, string>

type SegmentParams<T extends Record<string, unknown> = Record<string, string | string[] | undefined>> = T extends Record<string, unknown>
  ? { [K in SafeStringKey<T>]: T[K] extends string ? string | string[] | undefined : T[K] extends string[] ? string[] | undefined : never }
  : T

checkFields<Diff<{
  GET?: (...args: readonly any[]) => any
  HEAD?: (...args: readonly any[]) => any
  OPTIONS?: (...args: readonly any[]) => any
  POST?: (...args: readonly any[]) => any
  PUT?: (...args: readonly any[]) => any
  DELETE?: (...args: readonly any[]) => any
  PATCH?: (...args: readonly any[]) => any
  config?: Record<string, unknown>
  generateStaticParams?: (...args: readonly any[]) => any
  revalidate?: RevalidateRange<TEntry> | false
  dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static'
  dynamicParams?: boolean
  fetchCache?: 'auto' | 'force-no-store' | 'only-no-store' | 'default-no-store' | 'default-cache' | 'only-cache' | 'force-cache'
  preferredRegion?: 'auto' | 'global' | 'home' | string | readonly string[]
  runtime?: 'nodejs' | 'experimental-edge' | 'edge'
  maxDuration?: number
}, TEntry, ''>>()

type RouteContext = { readonly params: Promise<SegmentParams> }

type HttpMethod = 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Unrolled inline verification blocks for optimal type resolution overhead
if ('GET' in entry) {
  checkFields<Diff<ParamCheck<Request | NextRequest>, { __tag__: 'GET'; __param_position__: 'first'; __param_type__: FirstArg<MaybeField<TEntry, 'GET'>> }, 'GET'>>()
  checkFields<Diff<ParamCheck<RouteContext>, { __tag__: 'GET'; __param_position__: 'second'; __param_type__: SecondArg<MaybeField<TEntry, 'GET'>> }, 'GET'>>()
  checkFields<Diff<{ __tag__: 'GET'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'GET'; __return_type__: ReturnType<MaybeField<TEntry, 'GET'>> }, 'GET'>>()
}

if ('HEAD' in entry) {
  checkFields<Diff<ParamCheck<Request | NextRequest>, { __tag__: 'HEAD'; __param_position__: 'first'; __param_type__: FirstArg<MaybeField<TEntry, 'HEAD'>> }, 'HEAD'>>()
  checkFields<Diff<ParamCheck<RouteContext>, { __tag__: 'HEAD'; __param_position__: 'second'; __param_type__: SecondArg<MaybeField<TEntry, 'HEAD'>> }, 'HEAD'>>()
  checkFields<Diff<{ __tag__: 'HEAD'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'HEAD'; __return_type__: ReturnType<MaybeField<TEntry, 'HEAD'>> }, 'HEAD'>>()
}

if ('OPTIONS' in entry) {
  checkFields<Diff<ParamCheck<Request | NextRequest>, { __tag__: 'OPTIONS'; __param_position__: 'first'; __param_type__: FirstArg<MaybeField<TEntry, 'OPTIONS'>> }, 'OPTIONS'>>()
  checkFields<Diff<ParamCheck<RouteContext>, { __tag__: 'OPTIONS'; __param_position__: 'second'; __param_type__: SecondArg<MaybeField<TEntry, 'OPTIONS'>> }, 'OPTIONS'>>()
  checkFields<Diff<{ __tag__: 'OPTIONS'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'OPTIONS'; __return_type__: ReturnType<MaybeField<TEntry, 'OPTIONS'>> }, 'OPTIONS'>>()
}

if ('POST' in entry) {
  checkFields<Diff<ParamCheck<Request | NextRequest>, { __tag__: 'POST'; __param_position__: 'first'; __param_type__: FirstArg<MaybeField<TEntry, 'POST'>> }, 'POST'>>()
  checkFields<Diff<ParamCheck<RouteContext>, { __tag__: 'POST'; __param_position__: 'second'; __param_type__: SecondArg<MaybeField<TEntry, 'POST'>> }, 'POST'>>()
  checkFields<Diff<{ __tag__: 'POST'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'POST'; __return_type__: ReturnType<MaybeField<TEntry, 'POST'>> }, 'POST'>>()
}

if ('PUT' in entry) {
  checkFields<Diff<ParamCheck<Request | NextRequest>, { __tag__: 'PUT'; __param_position__: 'first'; __param_type__: FirstArg<MaybeField<TEntry, 'PUT'>> }, 'PUT'>>()
  checkFields<Diff<ParamCheck<RouteContext>, { __tag__: 'PUT'; __param_position__: 'second'; __param_type__: SecondArg<MaybeField<TEntry, 'PUT'>> }, 'PUT'>>()
  checkFields<Diff<{ __tag__: 'PUT'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'PUT'; __return_type__: ReturnType<MaybeField<TEntry, 'PUT'>> }, 'PUT'>>()
}

if ('DELETE' in entry) {
  checkFields<Diff<ParamCheck<Request | NextRequest>, { __tag__: 'DELETE'; __param_position__: 'first'; __param_type__: FirstArg<MaybeField<TEntry, 'DELETE'>> }, 'DELETE'>>()
  checkFields<Diff<ParamCheck<RouteContext>, { __tag__: 'DELETE'; __param_position__: 'second'; __param_type__: SecondArg<MaybeField<TEntry, 'DELETE'>> }, 'DELETE'>>()
  checkFields<Diff<{ __tag__: 'DELETE'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'DELETE'; __return_type__: ReturnType<MaybeField<TEntry, 'DELETE'>> }, 'DELETE'>>()
}

if ('PATCH' in entry) {
  checkFields<Diff<ParamCheck<Request | NextRequest>, { __tag__: 'PATCH'; __param_position__: 'first'; __param_type__: FirstArg<MaybeField<TEntry, 'PATCH'>> }, 'PATCH'>>()
  checkFields<Diff<ParamCheck<RouteContext>, { __tag__: 'PATCH'; __param_position__: 'second'; __param_type__: SecondArg<MaybeField<TEntry, 'PATCH'>> }, 'PATCH'>>()
  checkFields<Diff<{ __tag__: 'PATCH'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'PATCH'; __return_type__: ReturnType<MaybeField<TEntry, 'PATCH'>> }, 'PATCH'>>()
}

if ('generateStaticParams' in entry) {
  checkFields<Diff<{ readonly params: SegmentParams }, FirstArg<MaybeField<TEntry, 'generateStaticParams'>>, 'generateStaticParams'>>()
  checkFields<Diff<{ __tag__: 'generateStaticParams'; __return_type__: readonly any[] | Promise<readonly any[]> }, { __tag__: 'generateStaticParams'; __return_type__: ReturnType<MaybeField<TEntry, 'generateStaticParams'>> }>>()
}

export interface PageProps {
  readonly params?: Promise<SegmentParams>
  readonly searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export interface LayoutProps {
  readonly children?: React.ReactNode
  readonly params?: Promise<SegmentParams>
}

type RevalidateRange<T> = T extends { revalidate: infer R } ? (R extends Numeric ? NonNegative<R> : never) : never

type OmitWithTag<T, K extends keyof any, _M> = Omit<T, K>
type Diff<Base, T extends Base, Message extends string = ''> = 0 extends (1 & T) ? {} : OmitWithTag<T, keyof Base, Message>

type StrictFunction = (...args: never[]) => unknown
type FirstArg<T> = T extends (arg1: infer A, ...rest: any[]) => any ? (unknown extends A ? any : A) : never
type SecondArg<T> = T extends (arg1: any, arg2: infer B, ...rest: any[]) => any ? (unknown extends B ? any : B) : never
type MaybeField<T, K extends string> = T extends { [k in K]: infer G } ? (G extends (...args: any[]) => any ? G : never) : never

type ParamCheck<T> = {
  readonly __tag__: string
  readonly __param_position__: string
  readonly __param_type__: T
}

// Optimized empty function to minimize inline allocation costs and stack footprint
const checkFields = <_ extends { readonly [k in keyof any]: never } = never>(): void => {}

type Numeric = number | bigint
type Zero = 0 | 0n
type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never
type NonNegative<T extends Numeric> = T extends Zero ? T : Negative<T> extends never ? T : '__invalid_negative_number__'