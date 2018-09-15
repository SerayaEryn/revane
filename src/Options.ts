export default class Options {
  public noRedefinition?: boolean
  public basePackage: string
  public configurationFiles?: string[]
  public componentScan?: boolean
  public includeFilters?
  public excludeFilters?
  public resolverPlugins?: Array<any>
  public resolverOptions?: Array<any>
  public defaultScope?: string
}
