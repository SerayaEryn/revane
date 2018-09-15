import Options from './Options'

import JsonFileResolver from './resolvers/JsonFileResolver'
import XmlFileResolver from './resolvers/XmlFileResolver'
import ComponentScanResolver from './resolvers/ComponentScanResolver'
import UnknownEndingError from './UnknownEndingError'
import Revane from './RevaneCore'

export * from './decorators/Decorators'

export default class RevaneWithResolvers extends Revane {
  public async initialize (): Promise<void> {
    this.prepareOptions(this.options)
    await super.initialize()
  }

  private prepareOptions (options: Options) {
    const files = options.configurationFiles || []

    options.resolverOptions = (options.resolverOptions || []).concat(files.map((file) => {
      return { file: file }
    }))
    this.options = options
    this.options.resolverPlugins = (options.resolverPlugins || []).concat([
      JsonFileResolver,
      XmlFileResolver,
      ComponentScanResolver
    ])
    this.checkForUnknownEndings(this.options.resolverOptions, this.options.resolverPlugins)
    if (options.componentScan !== false) {
      this.options.resolverOptions.push({
        componentScan: true,
        basePackage: options.basePackage,
        includeFilters: options.includeFilters,
        excludeFilters: options.excludeFilters
      })
    }
    this.options.defaultScope = 'singleton'
  }

  private checkForUnknownEndings (files, resolvers): any {
    for (const file of files) {
      const relevant: Array<boolean> = []
      for (const ResolverClass of resolvers) {
        relevant.push(ResolverClass.isRelevant(file))
      }
      if (!relevant.includes(true)) {
        throw new UnknownEndingError()
      }
    }
  }
}
