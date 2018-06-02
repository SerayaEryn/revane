'use strict';

import Bean from './Bean';

export default class ValueBean extends Bean {
  private value;

  constructor(value) {
    super();
    this.value = value;
  }

  public getInstance() {
    return this.value;
  }
}
