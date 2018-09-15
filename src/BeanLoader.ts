import BeanResolverRegistry from './BeanLoaderRegistry'
import Options from './Options'

export default class BeanLoader {
  private beanResolverRegistry: BeanResolverRegistry

  constructor () {
    this.beanResolverRegistry = new BeanResolverRegistry()
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
      for (const ResolverClass of options.loaderPlugins) {
        if (ResolverClass.isRelevant(optionsForResolver)) {
          this.beanResolverRegistry.register(new ResolverClass(optionsForResolver))
        }
      }
    }
  }
}
