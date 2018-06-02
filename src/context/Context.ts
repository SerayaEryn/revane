'use strict';

import * as path from 'path';
import BeanDefinition from '../BeanDefinition';
import Container from './Container';
import BeanDefinedTwiceError from './errors/BeanDefinedTwiceError';
import ContextNotInitializedError from './errors/ContextNotInitializedError';

export default class Context {
  private options: any;
  private beanDefinitions: Map<string, BeanDefinition>;

  constructor(options: any) {
    this.options = options;
    this.beanDefinitions = new Map();
  }

  public initialize(): void {
    const container = new Container([...this.beanDefinitions.values()]);
    container.initialize();
    this.get = container.get.bind(container);
    this.getByType = container.getByType.bind(container);
    this.beanDefinitions = null;
  }

  public addBeanDefinition(beanDefinition: BeanDefinition): void {
    const exitingBeanDefininaton = this.beanDefinitions.get(beanDefinition.id);
    if (exitingBeanDefininaton && this.options.noRedefinition) {
      throw new BeanDefinedTwiceError(exitingBeanDefininaton.id);
    }
    const newBeanDefinition = new BeanDefinition(beanDefinition.id);
    newBeanDefinition.scope = beanDefinition.scope || 'singleton',
    newBeanDefinition.path = this.getPath(beanDefinition),
    newBeanDefinition.properties = beanDefinition.properties || [],
    newBeanDefinition.type = beanDefinition.type;
    this.beanDefinitions.set(beanDefinition.id, newBeanDefinition);
  }

  public addBeanDefinitions(beanDefinitions: BeanDefinition[]): void {
    for (const beanDefinition of beanDefinitions) {
      this.addBeanDefinition(beanDefinition);
    }
  }

  public get(id: string): any {
    throw new ContextNotInitializedError();
  }

  public getMultiple(ids: string[]): any[] {
    return ids.map(this.get);
  }

  public getByType(type: string): any {
    throw new ContextNotInitializedError();
  }

  private getPath(beanDefinition: BeanDefinition): string {
    if (!this.isRelative(beanDefinition) || this.isAbsolute(beanDefinition)) {
      return beanDefinition.class;
    }
    return path.join(this.options.basePackage, beanDefinition.class);
  }

  private isAbsolute(beanDefinition: BeanDefinition): boolean {
    return beanDefinition.class.startsWith('/');
  }

  private isRelative(beanDefinition: BeanDefinition): boolean {
    return beanDefinition.class.startsWith('.');
  }
}
