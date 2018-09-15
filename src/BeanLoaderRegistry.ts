import Loader from './resolvers/Loader'

export default class BeanResolverRegistry {
  private loaders: Loader[] = []

  public register (resolver) {
    this.loaders.push(resolver)
  }

  public get () {
    const promises = this.loaders.map((loader) => loader.load())
    return Promise.all(promises)
  }
}
