import { Component } from '../src/revane/Revane'

@Component({dependencies: ['scan1'], id: 'scan3'})
export class Scan3 {
  arg: any
  constructor (arg) {
    this.arg = arg
  }
}
