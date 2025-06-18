import { Controller, Get } from '../src/revane/Revane.js'

@Controller
export class Scan5 {
  @Get('/testerror/')
  public async test1() {
    const error = new Error("hallo")
    error['code'] = 'TEST_CODE'
    throw error
  }
}
