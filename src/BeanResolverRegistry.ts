export default class BeanResolverRegistry {
  private resolvers: any[]

  constructor () {
    this.resolvers = []
  }

  public register (resolver) {
    this.resolvers.push(resolver)
  }

  public get () {
    const promises = this.resolvers.map((resolver) => resolver.resolve())
    return Promise.all(promises)
  }
}
