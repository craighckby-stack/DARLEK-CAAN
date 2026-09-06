// File: /app/applet/src/app/api/brain/route.ts
import * as entry from '../../../../../src/app/api/brain/route.js'
import type { NextRequest } from 'next/server.js'

type RouteEntry = typeof import('../../../../../src/app/api/brain/route.js')

type SafeStringKey<T> = Extract<keyof T, string>

type SegmentParams<T extends Record<string, unknown> = Record<string, string | string[] | undefined>> = T extends Record<string, unknown>
  ? { [K in SafeStringKey<T>]: T[K] extends string ? string | string[] | undefined : T[K] extends string[] ? string[] | undefined : never }
  : T

validateRouteConfig<TypeDifference<{
  GET?: (...args: readonly any[]) => any
  HEAD?: (...args: readonly any[]) => any
  OPTIONS?: (...args: readonly any[]) => any
  POST?: (...args: readonly any[]) => any
  PUT?: (...args: readonly any[]) => any
  DELETE?: (...args: readonly any[]) => any
  PATCH?: (...args: readonly any[]) => any
  config?: Record<string, unknown>
  generateStaticParams?: (...args: readonly any[]) => any
  revalidate?: RevalidateRange<RouteEntry> | false
  dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static'
  dynamicParams?: boolean
  fetchCache?: 'auto' | 'force-no-store' | 'only-no-store' | 'default-no-store' | 'default-cache' | 'only-cache' | 'force-cache'
  preferredRegion?: 'auto' | 'global' | 'home' | string | readonly string[]
  runtime?: 'nodejs' | 'experimental-edge' | 'edge'
  maxDuration?: number
}, RouteEntry, ''>>()

type RouteContext = { readonly params: Promise<SegmentParams> }

type HttpMethod = 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

if ('GET' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { __tag__: 'GET'; __param_position__: 'first'; __param_type__: FirstArgument<MaybeField<RouteEntry, 'GET'>> }, 'GET'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { __tag__: 'GET'; __param_position__: 'second'; __param_type__: SecondArgument<MaybeField<RouteEntry, 'GET'>> }, 'GET'>>()
  validateRouteConfig<TypeDifference<{ __tag__: 'GET'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'GET'; __return_type__: ReturnType<MaybeField<RouteEntry, 'GET'>> }, 'GET'>>()
}

if ('HEAD' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { __tag__: 'HEAD'; __param_position__: 'first'; __param_type__: FirstArgument<MaybeField<RouteEntry, 'HEAD'>> }, 'HEAD'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { __tag__: 'HEAD'; __param_position__: 'second'; __param_type__: SecondArgument<MaybeField<RouteEntry, 'HEAD'>> }, 'HEAD'>>()
  validateRouteConfig<TypeDifference<{ __tag__: 'HEAD'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'HEAD'; __return_type__: ReturnType<MaybeField<RouteEntry, 'HEAD'>> }, 'HEAD'>>()
}

if ('OPTIONS' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { __tag__: 'OPTIONS'; __param_position__: 'first'; __param_type__: FirstArgument<MaybeField<RouteEntry, 'OPTIONS'>> }, 'OPTIONS'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { __tag__: 'OPTIONS'; __param_position__: 'second'; __param_type__: SecondArgument<MaybeField<RouteEntry, 'OPTIONS'>> }, 'OPTIONS'>>()
  validateRouteConfig<TypeDifference<{ __tag__: 'OPTIONS'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'OPTIONS'; __return_type__: ReturnType<MaybeField<RouteEntry, 'OPTIONS'>> }, 'OPTIONS'>>()
}

if ('POST' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { __tag__: 'POST'; __param_position__: 'first'; __param_type__: FirstArgument<MaybeField<RouteEntry, 'POST'>> }, 'POST'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { __tag__: 'POST'; __param_position__: 'second'; __param_type__: SecondArgument<MaybeField<RouteEntry, 'POST'>> }, 'POST'>>()
  validateRouteConfig<TypeDifference<{ __tag__: 'POST'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'POST'; __return_type__: ReturnType<MaybeField<RouteEntry, 'POST'>> }, 'POST'>>()
}

if ('PUT' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { __tag__: 'PUT'; __param_position__: 'first'; __param_type__: FirstArgument<MaybeField<RouteEntry, 'PUT'>> }, 'PUT'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { __tag__: 'PUT'; __param_position__: 'second'; __param_type__: SecondArgument<MaybeField<RouteEntry, 'PUT'>> }, 'PUT'>>()
  validateRouteConfig<TypeDifference<{ __tag__: 'PUT'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'PUT'; __return_type__: ReturnType<MaybeField<RouteEntry, 'PUT'>> }, 'PUT'>>()
}

if ('DELETE' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { __tag__: 'DELETE'; __param_position__: 'first'; __param_type__: FirstArgument<MaybeField<RouteEntry, 'DELETE'>> }, 'DELETE'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { __tag__: 'DELETE'; __param_position__: 'second'; __param_type__: SecondArgument<MaybeField<RouteEntry, 'DELETE'>> }, 'DELETE'>>()
  validateRouteConfig<TypeDifference<{ __tag__: 'DELETE'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'DELETE'; __return_type__: ReturnType<MaybeField<RouteEntry, 'DELETE'>> }, 'DELETE'>>()
}

if ('PATCH' in entry) {
  validateRouteConfig<TypeDifference<ParameterCheck<Request | NextRequest>, { __tag__: 'PATCH'; __param_position__: 'first'; __param_type__: FirstArgument<MaybeField<RouteEntry, 'PATCH'>> }, 'PATCH'>>()
  validateRouteConfig<TypeDifference<ParameterCheck<RouteContext>, { __tag__: 'PATCH'; __param_position__: 'second'; __param_type__: SecondArgument<MaybeField<RouteEntry, 'PATCH'>> }, 'PATCH'>>()
  validateRouteConfig<TypeDifference<{ __tag__: 'PATCH'; __return_type__: Response | void | never | Promise<Response | void | never> }, { __tag__: 'PATCH'; __return_type__: ReturnType<MaybeField<RouteEntry, 'PATCH'>> }, 'PATCH'>>()
}

if ('generateStaticParams' in entry) {
  validateRouteConfig<TypeDifference<{ readonly params: SegmentParams }, FirstArgument<MaybeField<RouteEntry, 'generateStaticParams'>>, 'generateStaticParams'>>()
  validateRouteConfig<TypeDifference<{ __tag__: 'generateStaticParams'; __return_type__: readonly any[] | Promise<readonly any[]> }, { __tag__: 'generateStaticParams'; __return_type__: ReturnType<MaybeField<RouteEntry, 'generateStaticParams'>> }>>()
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
type TypeDifference<Base, T extends Base, Message extends string = ''> = 0 extends (1 & T) ? {} : OmitWithTag<T, keyof Base, Message>

type StrictFunction = (...args: never[]) => unknown
type FirstArgument<T> = T extends (arg1: infer A, ...rest: any[]) => any ? (unknown extends A ? any : A) : never
type SecondArgument<T> = T extends (arg1: any, arg2: infer B, ...rest: any[]) => any ? (unknown extends B ? any : B) : never
type MaybeField<T, K extends string> = T extends { [k in K]: infer G } ? (G extends (...args: any[]) => any ? G : never) : never

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