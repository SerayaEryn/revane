import BeanResolverRegistry from './BeanResolverRegistry'
import Options from './Options'
import ComponentScanResolver from './resolvers/ComponentScanResolver'
import JsonFileResolver from './resolvers/JsonFileResolver'
import XmlFileResolver from './resolvers/XmlFileResolver'
import UnknownEndingError from './UnknownEndingError'

export default class BeanResolver {
  private fileResolvers = {
    '.json': JsonFileResolver,
    '.xml': XmlFileResolver
  }
  private supportedFileEndings = [
    '.json',
    '.xml'
  ]

  public getBeanDefinitions (options: Options) {
    try {
      const beanResolverRegistry = this.getBeanResolverRegistry(options)
      return beanResolverRegistry.get()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  private getBeanResolverRegistry (options: Options) {
    const files = options.configurationFiles || []
    const beanResolverRegistry = new BeanResolverRegistry()
    for (const file of files) {
      beanResolverRegistry.register(this.getResolver(file))
    }
    if (options.componentScan !== false) {
      beanResolverRegistry.register(new ComponentScanResolver(options))
    }
    return beanResolverRegistry
  }

  private getResolver (file) {
    const ending = this.getEnding(file)
    return new this.fileResolvers[ending](file)
  }

  private getEnding (file: string): string {
    for (const ending of this.supportedFileEndings) {
      if (file.endsWith(ending)) {
        return ending
      }
    }
    throw new UnknownEndingError()
  }
}
