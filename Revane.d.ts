declare class Options {
  public noRedefinition?: boolean
  public basePackage: string
  public configurationFiles?: string[]
  public componentScan?: boolean
  public includeFilters?
  public excludeFilters?
}

declare class Revane {
  constructor (options: Options)
  public initialize (): Promise<void>
  public get (id: string): any
  public has (id: string): boolean
  public getMultiple (ids: string[]): any[]
  public getByType (type: string): any[]
}

declare class ComponentOptions {
  public id: string
  public dependencies: string[]
}

export function Component(options?: string | ComponentOptions): Function
export function Repository(options?: string | ComponentOptions): Function
export function Service(options?: string | ComponentOptions): Function
export function Controller(options?: string | ComponentOptions): Function
export function Scope(scope: string): Function

export default Revane;
