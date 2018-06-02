import beanResolver from './BeanResolver';
import Context from './context/Context';
import NotInitializedError from './NotInitializedError';
import Options from './Options';

export * from './decorators/Decorators';

export default class Revane {
  private options: Options;
  private context: Context;
  private initialized: boolean = false;

  constructor(options: Options) {
    this.options = options;
  }

  public initialize(): Promise<void> {
    this.context = new Context(this.options);
    return beanResolver.getBeanDefinitions(this.options)
      .then((beanDefinitionResult) => {
        for (const beanDefinitions of beanDefinitionResult) {
          this.context.addBeanDefinitions(beanDefinitions);
        }
        this.context.initialize();
        this.initialized = true;
      });
  }

  public get(id: string): any {
    if (!this.initialized)
      throw new NotInitializedError();
    return this.context.get(id);
  }

  public getMultiple(ids: string[]): any[] {
    if (!this.initialized)
      throw new NotInitializedError();
    return this.context.getMultiple(ids);
  }

  public getByType(type: string): any[] {
    if (!this.initialized)
      throw new NotInitializedError();
    return this.context.getByType(type);
  }
}
