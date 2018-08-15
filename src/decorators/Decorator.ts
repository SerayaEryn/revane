import Options from './Options';

export default abstract class Decorator {
  protected options: Options;

  public create(options: Options) {
    this.options = options;
    return this.define.bind(this);
  }

  public abstract define(Class);
}
