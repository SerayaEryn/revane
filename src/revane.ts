'use strict';

import beanResolver from './BeanResolver';
import Context from './context/Context';
import NotInitializedError from './NotInitializedError';

export * from './decorators/Decorators';

export default class Revane {
  private options: object;
  constructor(options: object) {
    this.options = options;
  }

  public initialize(): Promise<void> {
    const context = new Context(this.options);
    return beanResolver.getBeanDefinitions(this.options)
      .then((beanDefinitionResult) => {
        for (const beanDefinitions of beanDefinitionResult) {
          context.addBeanDefinitions(beanDefinitions);
        }
        context.initialize();
        this.get = context.get.bind(context);
        this.getMultiple = context.getMultiple.bind(context);
        this.getByType = context.getByType.bind(context);
      });
  }

  public get(id: string): any {
    throw new NotInitializedError();
  }

  public getMultiple(ids: string[]): any {
    throw new NotInitializedError();
  }

  public getByType(type: string): any {
    throw new NotInitializedError();
  }
}
