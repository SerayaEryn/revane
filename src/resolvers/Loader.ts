import BeanDefinition from '../BeanDefinition'

export default interface Loader {
  load (): Promise<BeanDefinition[]>
}
