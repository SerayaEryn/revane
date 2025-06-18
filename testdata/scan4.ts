import { ControllerAdvice, ErrorHandler, ResponseStatus } from '../src/revane/Revane.js'

@ControllerAdvice
export class Scan4 {
  @ErrorHandler('TEST_CODE')
  @ResponseStatus(500)
  public async globalErrorHandler(_: Error): Promise<string> {
    console.log(_)
    return 'error handled'
  }
}
