'use strict';

import Decorator from './Decorator';

export default class Scope extends Decorator {
  public define(Class) {
    const scope = this.options;
    const value = {
      scope
    };
    return this.appendMetaData(Class, value);
  }
}
