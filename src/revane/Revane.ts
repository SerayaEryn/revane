import RevaneIOC, {
  BeanDefinition,
  Loader,
  XmlFileLoader,
  ComponentScanLoader,
  JsonFileLoader,
  RegexFilter,
  Repository,
  Service,
  Component,
  Controller,
  Scope,
  Bean,
  LoaderOptions,
  Configuration,
  ConfigurationProperties,
  ApplicationContext,
  ConditionalOnMissingBean,
  Scheduled,
  Scheduler
} from 'revane-ioc'
import { revaneBuilder } from './RevaneBuilder'
import RevaneFastify, {
  All,
  Get,
  Post,
  Param,
  Params,
  Patch,
  Delete,
  Options,
  Head,
  Put,
  Cookie,
  Cookies,
  Query,
  QueryParameters,
  RequestBody,
  Reply,
  Header,
  Headers,
  Log
} from 'revane-fastify'
import { Command } from './Command'

export class Revane {
  private serverCommands: Command[] = []
  private serverOptionCommands: Command[] = []
  private containerCommands: Command[] = []
  private server: RevaneFastify
  private container: RevaneIOC

  public register (id: string | any, options?: any): Revane {
    this.serverCommands.push({ type: 'register', args: [ id, options ] })
    return this
  }

  public registerControllers (): Revane {
    this.serverCommands.push({ type: 'registerControllers', args: [] })
    return this
  }

  public setErrorHandler (id: string): Revane {
    this.serverCommands.push({ type: 'setErrorHandler', args: [ id ] })
    return this
  }

  public setNotFoundHandler (id: string): Revane {
    this.serverCommands.push({ type: 'setNotFoundHandler', args: [ id ] })
    return this
  }

  public ready (handler: (err: Error) => void): Revane {
    this.serverCommands.push({ type: 'ready', args: [ handler ] })
    return this
  }

  public basePackage (path: string): Revane {
    this.containerCommands.push({ type: 'basePackage', args: [ path ] })
    return this
  }

  public componentScan (
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

  public xmlFile (file: string): Revane {
    this.containerCommands.push({ type: 'xmlFile', args: [ file ] })
    return this
  }

  public jsonFile (file: string): Revane {
    this.containerCommands.push({ type: 'jsonFile', args: [ file ] })
    return this
  }

  public noRedefinition (noRedefinition?: boolean): Revane {
    this.containerCommands.push({ type: 'noRedefinition', args: [ noRedefinition ] })
    return this
  }

  public disableAutoConfiguration (): Revane {
    this.containerCommands.push({ type: 'disableAutoConfiguration', args: [] })
    return this
  }

  public silent (isSilent: boolean): Revane {
    this.serverOptionCommands.push({ type: 'silent', args: [ isSilent ] })
    return this
  }

  public async initialize (): Promise<Revane> {
    const { container, server } = await revaneBuilder()
      .container(this.containerCommands)
      .server(this.serverOptionCommands, this.serverCommands)
      .build()
    this.container = container
    this.server = server
    process.on('SIGINT', () => this.shutdownGracefully('SIGINT'))
    process.on('SIGTERM', () => this.shutdownGracefully('SIGTERM'))
    this.disposeCommands()
    return this
  }

  public async getBean (id: string): Promise<any> {
    return this.container.get(id)
  }

  public port (): number {
    if (this.server) {
      return this.server.port()
    }
    return null
  }

  public async tearDown (): Promise<void> {
    if (this.server) {
      await this.server.close()
    }
    await this.container.close()
  }

  private async shutdownGracefully (event: string) {
    if (await this.container.has('logger')) {
      const logger = await this.container.get('logger')
      logger.info(`Received ${event} event. Shutdown in progress...`)
    } else {
      console.log(`Received ${event} event. Shutdown in progress...`)
    }
    this.tearDown()
      .then(() => process.exit(0))
      .catch((error: Error) => {
        console.error('Shutdown failed', error)
        process.exit(1)
      })
  }

  private disposeCommands (): void {
    this.serverCommands = null
    this.serverOptionCommands = null
    this.containerCommands = null
  }
}

export function revane (): Revane {
  return new Revane()
}

export {
  BeanDefinition,
  Loader,
  XmlFileLoader,
  ComponentScanLoader,
  JsonFileLoader,
  RegexFilter,
  LoaderOptions,
  Repository,
  Service,
  Component,
  Controller,
  Scope,
  Bean,
  All,
  Get,
  Post,
  Param,
  Params,
  Patch,
  Delete,
  Options,
  Head,
  Put,
  Cookie,
  Cookies,
  Query,
  QueryParameters,
  RequestBody,
  Reply,
  Header,
  Headers,
  Log,
  Configuration,
  ConfigurationProperties,
  ApplicationContext,
  ConditionalOnMissingBean,
  Scheduled,
  Scheduler
}

export default Revane
