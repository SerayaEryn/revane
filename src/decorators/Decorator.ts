'use strict';

export default abstract class Decorator {
  protected options;

  public create(options) {
    this.options = options;
    return this.define.bind(this);
  }

  public abstract define(Class);

  protected appendMetaData(Class, meta) {
    const oldMeta = Class.__componentmeta || {};
    const value = Object.assign(oldMeta, meta);
    Object.defineProperty(Class, '__componentmeta', {
      configurable: false,
      enumerable: false,
      value,
      writable: false
    });
    return Class;
  }
}
