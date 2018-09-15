import DefaultBeanLoaderRegistry from './DefaultBeanLoaderRegistry'
import Options from './Options'

export default class BeanLoader {
  private beanResolverRegistry: DefaultBeanLoaderRegistry

  constructor () {
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
      for (const Loader of options.loaderPlugins) {
        if (Loader.isRelevant(optionsForResolver)) {
          this.beanResolverRegistry.register(new Loader(optionsForResolver))
        }
      }
    }
  }
}
