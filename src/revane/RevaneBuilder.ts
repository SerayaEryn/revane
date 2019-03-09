import { ServerBuilder } from './ServerBuilder'
import { ContainerBuilder } from './ContainerBuilder'

export function revaneBuilder (): RevaneBuilder {
  return new RevaneBuilder()
}

export class RevaneBuilder {
  private serverBuilder: ServerBuilder
  private containerBuilder: ContainerBuilder

  server (serverBuilder: ServerBuilder): RevaneBuilder {
    this.serverBuilder = serverBuilder
    return this
  }

  container (containerBuilder: ContainerBuilder): RevaneBuilder {
    this.containerBuilder = containerBuilder
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
