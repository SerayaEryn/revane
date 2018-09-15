'use strict'

import Filter from './Filter'

export default class RegexFilter implements Filter {
  private regex: RegExp

  constructor (options: any) {
    this.regex = new RegExp(options.regex)
    this.applies.bind(this)
  }

  public applies (entry): boolean {
    return this.regex.test(entry.class)
  }
}
