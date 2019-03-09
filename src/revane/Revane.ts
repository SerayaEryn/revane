import RevaneIOC, { RegexFilter } from 'revane-ioc'
import { ServerBuilder } from './ServerBuilder'
import { revaneBuilder } from './RevaneBuilder'
import { ContainerBuilder } from './ContainerBuilder'
import RevaneFastify from 'revane-fastify'

export class Revane {
  private serverCommands = []
  private serverOptionCommands = []
  private containerCommands = []
  public server: RevaneFastify
  public container: RevaneIOC

  register (id: string | any, options?: any): Revane {
    this.serverCommands.push({ type: 'register', args: [ id, options ] })
    return this
  }

  registerControllers (): Revane {
    this.serverCommands.push({ type: 'registerControllers', args: [] })
    return this
  }

  setErrorHandler (id: string): Revane {
    this.serverCommands.push({ type: 'setErrorHandler', args: [ id ] })
    return this
  }

  setNotFoundHandler (id: string): Revane {
    this.serverCommands.push({ type: 'setNotFoundHandler', args: [ id ] })
    return this
  }

  ready (handler: (err: Error) => void): Revane {
    this.serverCommands.push({ type: 'ready', args: [ handler ] })
    return this
  }

  basePackage (path: string): Revane {
    this.containerCommands.push({ type: 'basePackage', args: [ path ] })
    return this
  }

  componentScan (
    path: string,
    excludeFilters?: RegexFilter[],
    includeFilters?: RegexFilter[]
  ): Revane {
    this.containerCommands.push({
      type: 'componentScan',
      args: [ path, excludeFilters, includeFilters ]
    })
    return this
  }

  xmlFile (file: string): Revane {
    this.containerCommands.push({ type: 'xmlFile', args: [ file ] })
    return this
  }

  jsonFile (file: string): Revane {
    this.containerCommands.push({ type: 'jsonFile', args: [ file ] })
    return this
  }

  noRedefinition (noRedefinition?: boolean): Revane {
    this.containerCommands.push({ type: 'noRedefinition', args: [ noRedefinition ] })
    return this
  }

  silent (isSilent: boolean): Revane {
    this.serverOptionCommands.push({ type: 'silent', args: [ isSilent ] })
    return this
  }

  public async initialize (): Promise<Revane> {
    const serverBuilder = new ServerBuilder(this.serverOptionCommands, this.serverCommands)
    const containerBuilder = new ContainerBuilder(this.containerCommands)
    const { container, server } = await revaneBuilder()
      .container(containerBuilder)
      .server(serverBuilder)
      .build()
    this.container = container
    this.server = server
    return this
  }

  public getBean (id: string): any {
    return this.container.get(id)
  }

  public port (): string {
    if (this.server) {
      return this.server.port()
    }
    return null
  }

  public async tearDown (): Promise<void> {
    if (this.server) {
      await this.server.close()
    }
    await this.container.tearDown()
  }
}

export function revane (): Revane {
  return new Revane()
}

export {
  Scope,
  Component,
  Repository,
  Controller,
  Service,
  Inject,
  RegexFilter,
  FileLoaderOptions,
  ComponentScanLoaderOptions
} from 'revane-ioc'

export default Revane
