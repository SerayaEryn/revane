import RevaneIOC, { ApplicationContext } from "revane-ioc";
import {
  RevaneFastify,
  revaneFastify,
  RevaneFastifyContext,
} from "revane-fastify";
import { Command } from "./Command.js";

export class ServerBuilder {
  private commands: Command[];
  private optionCommands: Command[];
  private revaneIOC: RevaneIOC;
  private options: any = {};
  private server: RevaneFastify;

  constructor(optionCommands, commands) {
    this.optionCommands = optionCommands;
    this.commands = commands;
  }

  container(container: RevaneIOC): ServerBuilder {
    this.revaneIOC = container;
    return this;
  }

  register(id: string | any, options?: any): void {
    this.server.register(id, options);
  }

  registerControllers(): void {
    this.server.registerControllers();
  }

  setErrorHandler(id: string | any): void {
    this.server.setErrorHandler(id);
  }

  setNotFoundHandler(id: string | any): void {
    this.server.setNotFoundHandler(id);
  }

  ready(handler: (error: Error) => void) {
    this.server.ready(handler);
  }

  silent(isSilent?: boolean): void {
    this.options.silent = isSilent;
  }

  name(aName?: string): void {
    this.options.name = aName;
  }

  async build(): Promise<RevaneFastify> {
    if (this.commands.length === 0) {
      return Promise.resolve(null);
    }

    this.#processCommands(this.optionCommands);
    await this.#createServer();
    this.#processCommands(this.commands);

    await this.server.listen("configuration");
    return this.server;
  }

  #processCommands(commands: Command[]) {
    for (const command of commands) {
      this[command.type](...command.args);
    }
  }

  async #createServer() {
    const context = new Context(this.revaneIOC.getContext());
    const configuration = await context.getById("configuration");
    if (configuration.get("revane.original-profile") == null) {
      const logger = await context.getById("rootLogger");
      if (logger != null) {
        logger.info(
          `No active profile set, falling back to default profiles: default`,
        );
      }
    }
    this.server = revaneFastify(this.options, context);
  }
}

class Context implements RevaneFastifyContext {
  constructor(private applicationContext: ApplicationContext) {}

  public async hasById(id: string): Promise<boolean> {
    return this.applicationContext.hasById(id);
  }

  public asyncgetByComponentType(type: string): Promise<any[]> {
    return this.applicationContext.getByType(type);
  }

  public async getById(id: string): Promise<any> {
    return this.applicationContext.getById(id);
  }

  public async getByMetadata(metadata: string | symbol): Promise<any[]> {
    return this.applicationContext.getByMetadata(metadata);
  }
}
