'use strict'

import Filter from './Filter'

export default class RegexFilter implements Filter {
  private regex: RegExp

  constructor (options: any) {
    this.regex = new RegExp(options.regex)
    this.applies = this.applies.bind(this)
  }

  public applies (clazz): boolean {
    return this.regex.test(clazz)
  }
}
