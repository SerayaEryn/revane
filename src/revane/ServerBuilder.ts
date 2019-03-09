import RevaneIOC from 'revane-ioc'
import RevaneIOCBeanProvicer from './RevaneIOCBeanProvider'
import RevaneFastify from 'revane-fastify'

export class ServerBuilder {
  private commands
  private optionCommands
  private revaneIOC: RevaneIOC
  private options: any = {}
  private addressProviderId: string
  private server: RevaneFastify

  constructor (optionCommands, commands) {
    this.optionCommands = optionCommands
    this.commands = commands
  }

  container (container: RevaneIOC): ServerBuilder {
    this.revaneIOC = container
    return this
  }

  register (id: string | any, options?: any): void {
    this.server.register(id, options)
  }

  registerControllers (): void {
    this.server.registerControllers()
  }

  setErrorHandler (id: string | any): void {
    this.server.setErrorHandler(id)
  }

  setNotFoundHandler (id: string | any): void {
    this.server.setNotFoundHandler(id)
  }

  ready (handler: (error: Error) => void) {
    this.server.ready(handler)
  }

  silent (isSilent?: boolean): void {
    this.options.silent = isSilent
  }

  async build (): Promise<RevaneFastify> {
    if (this.commands.length === 0) {
      return Promise.resolve(null)
    }

    for (const command of this.optionCommands) {
      this[command.type](...command.args)
    }

    const beanProvider = new RevaneIOCBeanProvicer(this.revaneIOC)
    this.server = new RevaneFastify(this.options, beanProvider)

    for (const command of this.commands) {
      this[command.type](...command.args)
    }
    await this.server.listen('configuration')
    return this.server
  }
}
