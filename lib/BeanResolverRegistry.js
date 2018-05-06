'use strict';

module.exports = class BeanResolverRegistry {
  constructor() {
    this.resolvers = [];
  }

  register(resolver) {
    this.resolvers.push(resolver);
  }

  get() {
    const promises = this.resolvers.map((resolver) => resolver.resolve());
    return Promise.all(promises);
  }
};
