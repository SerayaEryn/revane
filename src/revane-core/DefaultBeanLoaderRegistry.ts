import Loader from './Loader'
import BeanDefinition from './BeanDefinition'
import BeanLoaderRegistry from './BeanLoaderRegistry'

export default class DefaultBeanLoaderRegistry implements BeanLoaderRegistry {
  private loaders: Loader[] = []

  public register (loader): void {
    this.loaders.push(loader)
  }

  public get (): Promise<BeanDefinition[][]> {
    const promises = this.loaders.map((loader) => loader.load())
    return Promise.all(promises)
  }
}
