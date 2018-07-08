'use strict';

export default abstract class Decorator {
  protected options;

  public create(options) {
    this.options = options;
    return this.define.bind(this);
  }

  public abstract define(Class);
}
