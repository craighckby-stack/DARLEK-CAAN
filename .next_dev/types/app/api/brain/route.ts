// File: /app/applet/src/app/api/brain/route.ts
import * as entry from '../../../../../src/app/api/brain/route.js'
import type { NextRequest } from 'next/server.js'

type RouteEntry = typeof import('../../../../../src/app/api/brain/route.js')

type SafeStringKey<T> = Extract<keyof T, string>

type SegmentParams<T extends Record<string, unknown> = Record<string, string | string[] | undefined>> = T extends Record<string, unknown>
  ? { readonly [K in SafeStringKey<T>]: T[K] extends string ? string | string[] | undefined : T[K] extends string[] ? string[] | undefined : never }
  : T

validateRouteConfig<TypeDifference<{
  readonly GET?: (...args: readonly any[]) => any
  readonly HEAD?: (...args: readonly any[]) => any
  readonly OPTIONS?: (...args: readonly any[]) => any
  readonly POST?: (...args: readonly any[]) => any
  readonly PUT?: (...args: readonly any[]) => any
  readonly DELETE?: (...args: readonly any[]) => any
  readonly PATCH?: (...args: readonly any[]) => any
  readonly config?: Record<string, unknown>
  readonly generateStaticParams?: (...args: readonly any[]) => any
  readonly revalidate?: RevalidateRange<RouteEntry> | false
  readonly dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static'
  readonly dynamicParams?: boolean
  readonly fetchCache?: 'auto' | 'force-no-store' | 'only-no-store' | 'default-no-store' | 'default-cache' | 'only-cache' | 'force-cache'
  readonly preferredRegion?: 'auto' | 'global' | 'home' | string | readonly string[]
  readonly runtime?: 'nodejs' | 'experimental-edge' | 'edge'
  readonly maxDuration?: number
}, RouteEntry, ''>>()

type RouteContext = { readonly params: Promise<SegmentParams> }

type HttpMethod = 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

if ('GET' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { readonly __tag__: 'GET'; readonly __param_position__: 'first'; readonly __param_type__: FirstArgument<MaybeField<RouteEntry, 'GET'>> }, 'GET'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { readonly __tag__: 'GET'; readonly __param_position__: 'second'; readonly __param_type__: SecondArgument<MaybeField<RouteEntry, 'GET'>> }, 'GET'>>()
  validateRouteConfig<TypeDifference<{ readonly __tag__: 'GET'; readonly __return_type__: Response | void | never | Promise<Response | void | never> }, { readonly __tag__: 'GET'; readonly __return_type__: ReturnType<MaybeField<RouteEntry, 'GET'>> }, 'GET'>>()
}

if ('HEAD' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { readonly __tag__: 'HEAD'; readonly __param_position__: 'first'; readonly __param_type__: FirstArgument<MaybeField<RouteEntry, 'HEAD'>> }, 'HEAD'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { readonly __tag__: 'HEAD'; readonly __param_position__: 'second'; readonly __param_type__: SecondArgument<MaybeField<RouteEntry, 'HEAD'>> }, 'HEAD'>>()
  validateRouteConfig<TypeDifference<{ readonly __tag__: 'HEAD'; readonly __return_type__: Response | void | never | Promise<Response | void | never> }, { readonly __tag__: 'HEAD'; readonly __return_type__: ReturnType<MaybeField<RouteEntry, 'HEAD'>> }, 'HEAD'>>()
}

if ('OPTIONS' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { readonly __tag__: 'OPTIONS'; readonly __param_position__: 'first'; readonly __param_type__: FirstArgument<MaybeField<RouteEntry, 'OPTIONS'>> }, 'OPTIONS'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { readonly __tag__: 'OPTIONS'; readonly __param_position__: 'second'; readonly __param_type__: SecondArgument<MaybeField<RouteEntry, 'OPTIONS'>> }, 'OPTIONS'>>()
  validateRouteConfig<TypeDifference<{ readonly __tag__: 'OPTIONS'; readonly __return_type__: Response | void | never | Promise<Response | void | never> }, { readonly __tag__: 'OPTIONS'; readonly __return_type__: ReturnType<MaybeField<RouteEntry, 'OPTIONS'>> }, 'OPTIONS'>>()
}

if ('POST' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { readonly __tag__: 'POST'; readonly __param_position__: 'first'; readonly __param_type__: FirstArgument<MaybeField<RouteEntry, 'POST'>> }, 'POST'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { readonly __tag__: 'POST'; readonly __param_position__: 'second'; readonly __param_type__: SecondArgument<MaybeField<RouteEntry, 'POST'>> }, 'POST'>>()
  validateRouteConfig<TypeDifference<{ readonly __tag__: 'POST'; readonly __return_type__: Response | void | never | Promise<Response | void | never> }, { readonly __tag__: 'POST'; readonly __return_type__: ReturnType<MaybeField<RouteEntry, 'POST'>> }, 'POST'>>()
}

if ('PUT' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { readonly __tag__: 'PUT'; readonly __param_position__: 'first'; readonly __param_type__: FirstArgument<MaybeField<RouteEntry, 'PUT'>> }, 'PUT'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { readonly __tag__: 'PUT'; readonly __param_position__: 'second'; readonly __param_type__: SecondArgument<MaybeField<RouteEntry, 'PUT'>> }, 'PUT'>>()
  validateRouteConfig<TypeDifference<{ readonly __tag__: 'PUT'; readonly __return_type__: Response | void | never | Promise<Response | void | never> }, { readonly __tag__: 'PUT'; readonly __return_type__: ReturnType<MaybeField<RouteEntry, 'PUT'>> }, 'PUT'>>()
}

if ('DELETE' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { readonly __tag__: 'DELETE'; readonly __param_position__: 'first'; readonly __param_type__: FirstArgument<MaybeField<RouteEntry, 'DELETE'>> }, 'DELETE'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { readonly __tag__: 'DELETE'; readonly __param_position__: 'second'; readonly __param_type__: SecondArgument<MaybeField<RouteEntry, 'DELETE'>> }, 'DELETE'>>()
  validateRouteConfig<TypeDifference<{ readonly __tag__: 'DELETE'; readonly __return_type__: Response | void | never | Promise<Response | void | never> }, { readonly __tag__: 'DELETE'; readonly __return_type__: ReturnType<MaybeField<RouteEntry, 'DELETE'>> }, 'DELETE'>>()
}

if ('PATCH' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { readonly __tag__: 'PATCH'; readonly __param_position__: 'first'; readonly __param_type__: FirstArgument<MaybeField<RouteEntry, 'PATCH'>> }, 'PATCH'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { readonly __tag__: 'PATCH'; readonly __param_position__: 'second'; readonly __param_type__: SecondArgument<MaybeField<RouteEntry, 'PATCH'>> }, 'PATCH'>>()
  validateRouteConfig<TypeDifference<{ readonly __tag__: 'PATCH'; readonly __return_type__: Response | void | never | Promise<Response | void | never> }, { readonly __tag__: 'PATCH'; readonly __return_type__: ReturnType<MaybeField<RouteEntry, 'PATCH'>> }, 'PATCH'>>()
}

if ('generateStaticParams' in entry) {
  validateRouteConfig<TypeDifference<{ readonly params: SegmentParams }, FirstArgument<MaybeField<RouteEntry, 'generateStaticParams'>>, 'generateStaticParams'>>()
  validateRouteConfig<TypeDifference<{ readonly __tag__: 'generateStaticParams'; readonly __return_type__: readonly any[] | Promise<readonly any[]> }, { readonly __tag__: 'generateStaticParams'; readonly __return_type__: ReturnType<MaybeField<RouteEntry, 'generateStaticParams'>> }>>()
}

export interface PageProps {
  readonly params?: Promise<SegmentParams>
  readonly searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export interface LayoutProps {
  readonly children?: React.ReactNode
  readonly params?: Promise<SegmentParams>
}

type RevalidateRange<T> = T extends { readonly revalidate: infer R } ? (R extends Numeric ? NonNegative<R> : never) : never

type OmitWithTag<T, K extends keyof any, _M> = Omit<T, K>
type TypeDifference<Base, T extends Base, Message extends string = ''> = 0 extends (1 & T) ? {} : OmitWithTag<T, keyof Base, Message>

type StrictFunction = (...args: readonly never[]) => unknown
type FirstArgument<T> = T extends (arg1: infer A, ...rest: readonly any[]) => any ? (unknown extends A ? any : A) : never
type SecondArgument<T> = T extends (arg1: any, arg2: infer B, ...rest: readonly any[]) => any ? (unknown extends B ? any : B) : never
type MaybeField<T, K extends string> = T extends { readonly [k in K]: infer G } ? (G extends (...args: readonly any[]) => any ? G : never) : never

type ParameterCheck<T> = {
  readonly __tag__: string
  readonly __param_position__: string
  readonly __param_type__: T
}

const validateRouteConfig = <_ extends { readonly [k in keyof any]: never } = never>(): void => {}

type Numeric = number | bigint
type Zero = 0 | 0n
type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never
type NonNegative<T extends Numeric> = T extends Zero ? T : Negative<T> extends never ? T : '__invalid_negative_number__'