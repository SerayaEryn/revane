import BeanResolverRegistry from './BeanResolverRegistry'
import Options from './Options'

export default class BeanResolver {
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
    for (const optionsForResolver of options.resolverOptions) {
      for (const ResolverClass of options.resolverPlugins) {
        if (ResolverClass.isRelevant(optionsForResolver)) {
          this.beanResolverRegistry.register(new ResolverClass(optionsForResolver))
        }
      }
    }
  }
}
