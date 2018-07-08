'use strict';

import 'reflect-metadata';
import Decorator from './Decorator';

export default class Scope extends Decorator {
  public define(Class) {
    const scope = this.options;
    Reflect.defineMetadata('scope', scope, Class);
    return Class;
  }
}
