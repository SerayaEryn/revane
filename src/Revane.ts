import Options from './Options'

import JsonFileLoader from './resolvers/JsonFileLoader'
import XmlFileLoader from './resolvers/XmlFileLoader'
import ComponentScanLoader from './resolvers/ComponentScanLoader'
import UnknownEndingError from './UnknownEndingError'
import Revane from './RevaneCore'

export * from './decorators/Decorators'

export default class RevaneWithResolvers extends Revane {
  public async initialize (): Promise<void> {
    this.prepareOptions(this.options)
    await super.initialize()
  }

  private prepareOptions (options: Options) {
    const files: string[] = options.configurationFiles || []

    options.loaderOptions = (options.loaderOptions || []).concat(files.map((file) => {
      return { file: file }
    }))
    this.options = options
    this.options.loaderPlugins = (options.loaderPlugins || []).concat([
      JsonFileLoader,
      XmlFileLoader,
      ComponentScanLoader
    ])
    this.checkForUnknownEndings(this.options.loaderOptions, this.options.loaderPlugins)
    if (options.componentScan !== false) {
      this.options.loaderOptions.push({
        componentScan: true,
        basePackage: options.basePackage,
        includeFilters: options.includeFilters,
        excludeFilters: options.excludeFilters
      })
    }
    this.options.defaultScope = 'singleton'
  }

  private checkForUnknownEndings (files, loaders): void {
    for (const file of files) {
      const relevant: Array<boolean> = []
      for (const LoaderClass of loaders) {
        relevant.push(LoaderClass.isRelevant(file))
      }
      if (!relevant.includes(true)) {
        throw new UnknownEndingError()
      }
    }
  }
}
