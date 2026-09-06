// File: /app/applet/src/app/page.tsx
import * as entry from '../../../src/app/page.js'
import type { ResolvingMetadata, ResolvingViewport } from 'next/dist/lib/metadata/types/metadata-interface.js'

type PageModuleEntry = typeof import('../../../src/app/page.js')

type SafeKey<KeyType> = KeyType extends '__proto__' | 'prototype' | 'constructor' ? never : KeyType

type SegmentParams<TargetObject extends object = Record<string, string | string[] | undefined>> = TargetObject extends Record<string, any>
  ? { [Key in keyof TargetObject as SafeKey<Key>]: TargetObject[Key] extends string ? string | string[] | undefined : TargetObject[Key] extends string[] ? string[] | undefined : never }
  : TargetObject

validateModuleFields<TypeDifference<{
  default: (...args: any[]) => any
  config?: Record<string, unknown>
  generateStaticParams?: (...args: any[]) => any
  revalidate?: RevalidateRange<PageModuleEntry> | false
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
}, PageModuleEntry, ''>>()

validateModuleFields<TypeDifference<PageProps, FirstArgument<PageModuleEntry['default']>, 'default'>>()

if ('generateMetadata' in entry) {
  validateModuleFields<TypeDifference<PageProps, FirstArgument<MaybeField<PageModuleEntry, 'generateMetadata'>>, 'generateMetadata'>>()
  validateModuleFields<TypeDifference<ResolvingMetadata, SecondArgument<MaybeField<PageModuleEntry, 'generateMetadata'>>, 'generateMetadata'>>()
}

if ('generateViewport' in entry) {
  validateModuleFields<TypeDifference<PageProps, FirstArgument<MaybeField<PageModuleEntry, 'generateViewport'>>, 'generateViewport'>>()
  validateModuleFields<TypeDifference<ResolvingViewport, SecondArgument<MaybeField<PageModuleEntry, 'generateViewport'>>, 'generateViewport'>>()
}

if ('generateStaticParams' in entry) {
  validateModuleFields<TypeDifference<{ params: SegmentParams }, FirstArgument<MaybeField<PageModuleEntry, 'generateStaticParams'>>, 'generateStaticParams'>>()
  validateModuleFields<TypeDifference<{ __tag__: 'generateStaticParams', __return_type__: any[] | Promise<any[]> }, { __tag__: 'generateStaticParams', __return_type__: ReturnType<MaybeField<PageModuleEntry, 'generateStaticParams'>> }>>()
}

export interface PageProps {
  params?: Promise<SegmentParams>
  searchParams?: Promise<any>
}

export interface LayoutProps {
  children?: React.ReactNode
  params?: Promise<SegmentParams>
}

type RevalidateRange<T> = T extends { revalidate: any } ? NonNegativeNumeric<T['revalidate']> : never

type OmitWithTag<ObjectType, KeysToOmit extends keyof any, _Tag> = Omit<ObjectType, KeysToOmit & keyof ObjectType>
type TypeDifference<BaseType, DerivedType extends BaseType, ErrorMessage extends string = ''> = 0 extends (1 & DerivedType) ? {} : OmitWithTag<DerivedType, keyof BaseType, ErrorMessage>

type FirstArgument<FuncType> = FuncType extends (firstParam: infer FirstArgType, ...rest: any[]) => any
  ? unknown extends FirstArgType ? any : FirstArgType
  : never

type SecondArgument<FuncType> = FuncType extends (firstParam: any, secondParam: infer SecondArgType, ...rest: any[]) => any
  ? unknown extends SecondArgType ? any : SecondArgType
  : never

type MaybeField<ModuleType, FieldName extends string> = ModuleType extends { [Key in FieldName]?: infer FieldValue }
  ? [FieldValue] extends [(...args: any[]) => any]
    ? FieldValue
    : never
  : never

const validateModuleFields = <_FieldsValidation extends { [Key in keyof any]: never }>(..._args: unknown[]): void => {}

type Numeric = number | bigint
type Zero = 0 | 0n
type NegativeNumeric<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never
type NonNegativeNumeric<T extends Numeric> = T extends Zero ? T : NegativeNumeric<T> extends never ? (number extends T ? T : T) : '__invalid_negative_number__'