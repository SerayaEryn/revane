import BeanDefinition from '../BeanDefinition';

export default interface Resolver {
  resolve(): Promise<BeanDefinition[]>;
}
