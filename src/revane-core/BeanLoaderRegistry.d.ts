import BeanDefinition from './BeanDefinition'

export default interface BeanLoaderRegistry {
  register (loader): void
  get (): Promise<BeanDefinition[][]>
}
