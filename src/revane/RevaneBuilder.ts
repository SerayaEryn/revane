import { ServerBuilder } from "./ServerBuilder.js";
import { ContainerBuilder } from "./ContainerBuilder.js";
import { Command } from "./Command.js";

export function revaneBuilder(): RevaneBuilder {
  return new RevaneBuilder();
}

export class RevaneBuilder {
  private serverBuilder: ServerBuilder;
  private containerBuilder: ContainerBuilder;

  server(
    serverOptionCommands: Command[],
    serverCommands: Command[],
  ): RevaneBuilder {
    this.serverBuilder = new ServerBuilder(
      serverOptionCommands,
      serverCommands,
    );
    return this;
  }

  container(containerCommands: Command[]): RevaneBuilder {
    this.containerBuilder = new ContainerBuilder(containerCommands);
    return this;
  }

  async build() {
    const container = await this.containerBuilder.build();
    const server = await this.serverBuilder.container(container).build();
    return { container, server };
  }
}
