import CoreOptions from '../revane-core/Options'
import RevaneCore from '../revane-core/RevaneCore'
import DefaultBeanTypeRegistry from '../revane-core/context/DefaultBeanTypeRegistry'

import JsonFileLoader from './loaders/JsonFileLoader'
import XmlFileLoader from './loaders/XmlFileLoader'
import ComponentScanLoader from './loaders/ComponentScanLoader'
import UnknownEndingError from './UnknownEndingError'
import PrototypeBean from './bean/PrototypeBean'
import SingletonBean from './bean/SingletonBean'
import Options from './Options'
import NotInitializedError from './NotInitializedError'

export * from './decorators/Decorators'

export default class Revane {
  private revaneCore: RevaneCore
  private options: Options
  private initialized: boolean = false

  constructor (options: Options) {
    this.options = options
  }

  public async initialize (): Promise<void> {
    const coreOptions: CoreOptions = this.prepareOptions(this.options)
    const beanTypeRegistry = new DefaultBeanTypeRegistry()
    beanTypeRegistry.register(SingletonBean)
    beanTypeRegistry.register(PrototypeBean)
    this.revaneCore = new RevaneCore(coreOptions, beanTypeRegistry)
    this.revaneCore.addPlugin('loader', JsonFileLoader)
    this.revaneCore.addPlugin('loader', XmlFileLoader)
    this.revaneCore.addPlugin('loader', ComponentScanLoader)
    await this.revaneCore.initialize()
    this.initialized = true
  }

  public get (id: string): any {
    this.checkIfInitialized()
    return this.revaneCore.get(id)
  }

  public has (id: string): boolean {
    this.checkIfInitialized()
    return this.revaneCore.has(id)
  }

  public getMultiple (ids: string[]): any[] {
    this.checkIfInitialized()
    return this.revaneCore.getMultiple(ids)
  }

  public getByType (type: string): any[] {
    this.checkIfInitialized()
    return this.revaneCore.getByType(type)
  }

  private prepareOptions (options: Options): CoreOptions {
    const coreOptions: CoreOptions = new CoreOptions()
    const files: string[] = options.configurationFiles || []

    coreOptions.loaderOptions = files.map((file) => {
      return { file: file }
    })
    this.checkForUnknownEndings(coreOptions.loaderOptions)
    if (options.componentScan !== false) {
      coreOptions.loaderOptions.push({
        componentScan: true,
        basePackage: options.basePackage,
        includeFilters: options.includeFilters,
        excludeFilters: options.excludeFilters
      })
    }
    coreOptions.defaultScope = 'singleton'
    coreOptions.basePackage = options.basePackage
    return coreOptions
  }

  private checkForUnknownEndings (files): void {
    const loaderClasses = [XmlFileLoader, JsonFileLoader, ComponentScanLoader]
    for (const file of files) {
      const relevant: Array<boolean> = []
      for (const loaderClass of loaderClasses) {
        relevant.push(loaderClass.isRelevant(file))
      }
      if (!relevant.includes(true)) {
        throw new UnknownEndingError()
      }
    }
  }

  private checkIfInitialized (): void {
    if (!this.initialized) {
      throw new NotInitializedError()
    }
  }
}
