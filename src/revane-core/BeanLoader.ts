import DefaultBeanLoaderRegistry from './DefaultBeanLoaderRegistry'
import Options from './Options'

export default class BeanLoader {
  private beanResolverRegistry: DefaultBeanLoaderRegistry
  private loaders: any[]

  constructor (loaders: any[]) {
    this.loaders = loaders
    this.beanResolverRegistry = new DefaultBeanLoaderRegistry()
  }

  public getBeanDefinitions (options: Options) {
    try {
      this.prepareBeanResolverRegistry(options)
      return this.beanResolverRegistry.get()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  private prepareBeanResolverRegistry (options: Options): void {
    for (const optionsForResolver of options.loaderOptions) {
      for (const Loader of this.loaders) {
        if (Loader.isRelevant(optionsForResolver)) {
          this.beanResolverRegistry.register(new Loader(optionsForResolver))
        }
      }
    }
  }
}
