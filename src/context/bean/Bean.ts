export default abstract class Bean {
  protected isClass: boolean;

  public abstract getInstance();

  protected createInstance(Clazz, dependencies) {
    if (this.isClass) {
      return new Clazz(...dependencies);
    } else {
      return Clazz;
    }
  }
}
