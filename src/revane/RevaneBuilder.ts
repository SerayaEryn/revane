import { ServerBuilder } from './ServerBuilder'
import { ContainerBuilder } from './ContainerBuilder'
import { Command } from './Command'

export function revaneBuilder (): RevaneBuilder {
  return new RevaneBuilder()
}

export class RevaneBuilder {
  private serverBuilder: ServerBuilder
  private containerBuilder: ContainerBuilder

  server (serverOptionCommands: Command[], serverCommands: Command[]): RevaneBuilder {
    this.serverBuilder = new ServerBuilder(serverOptionCommands, serverCommands)
    return this
  }

  container (containerCommands: Command[]): RevaneBuilder {
    this.containerBuilder = new ContainerBuilder(containerCommands)
    return this
  }

  async build () {
    const container = await this.containerBuilder.build()
    const server = await this.serverBuilder
      .container(container)
      .build()
    return { container, server }
  }
}
