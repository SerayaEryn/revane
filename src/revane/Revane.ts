import RevaneIOC, {
  BeanDefinition,
  Loader,
  XmlFileLoader,
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
  Scheduler,
  ControllerAdvice,
  Logger,
  PostConstruct,
  PreDestroy,
  RevaneConfiguration,
} from "revane-ioc";
import { revaneBuilder } from "./RevaneBuilder.js";
import {
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
  Body,
  Response,
  RevaneResponse,
  RevaneRequest,
  Header,
  Headers,
  Log,
  RevaneFastify,
  ErrorHandler,
  ResponseStatus,
} from "revane-fastify";
import { Command } from "./Command.js";

export class Revane {
  private serverCommands: Command[] = [];
  private serverOptionCommands: Command[] = [];
  private containerCommands: Command[] = [];
  private server: RevaneFastify;
  private container: RevaneIOC;
  #name: string = applicationName();

  public register(id: string | any, options?: any): Revane {
    this.serverCommands.push({ type: "register", args: [id, options] });
    return this;
  }

  public registerControllers(): Revane {
    this.serverCommands.push({ type: "registerControllers", args: [] });
    return this;
  }

  public setErrorHandler(id: string): Revane {
    this.serverCommands.push({ type: "setErrorHandler", args: [id] });
    return this;
  }

  public setNotFoundHandler(id: string): Revane {
    this.serverCommands.push({ type: "setNotFoundHandler", args: [id] });
    return this;
  }

  public ready(handler: (err: Error) => void): Revane {
    this.serverCommands.push({ type: "ready", args: [handler] });
    return this;
  }

  public basePackage(path: string): Revane {
    this.containerCommands.push({ type: "basePackage", args: [path] });
    return this;
  }

  public componentScan(
    path: string,
    excludeFilters?: RegexFilter[],
    includeFilters?: RegexFilter[],
  ): Revane {
    this.containerCommands.push({
      type: "componentScan",
      args: [path, excludeFilters, includeFilters],
    });
    return this;
  }

  public xmlFile(file: string): Revane {
    this.containerCommands.push({ type: "xmlFile", args: [file] });
    return this;
  }

  public jsonFile(file: string): Revane {
    this.containerCommands.push({ type: "jsonFile", args: [file] });
    return this;
  }

  public noRedefinition(noRedefinition?: boolean): Revane {
    this.containerCommands.push({
      type: "noRedefinition",
      args: [noRedefinition],
    });
    return this;
  }

  public configurationDir(path: string): Revane {
    this.containerCommands.push({ type: "configurationDir", args: [path] });
    return this;
  }

  public disableAutoConfiguration(): Revane {
    this.containerCommands.push({ type: "disableAutoConfiguration", args: [] });
    return this;
  }

  public silent(isSilent: boolean): Revane {
    this.serverOptionCommands.push({ type: "silent", args: [isSilent] });
    return this;
  }

  public async initialize(): Promise<Revane> {
    if (
      this.serverCommands.filter(
        (command) => command.type === "registerControllers",
      ).length === 0
    ) {
      this.registerControllers();
    }
    this.serverCommands.push({ type: "name", args: [this.#name] });
    const { container, server } = await revaneBuilder()
      .container(this.containerCommands)
      .server(this.serverOptionCommands, this.serverCommands)
      .build();
    this.container = container;
    this.server = server;
    process.on("SIGINT", () => this.shutdownGracefully("SIGINT"));
    process.on("SIGTERM", () => this.shutdownGracefully("SIGTERM"));
    process.on("multipleResolves", (type, promise, reason: Error) =>
      this.logUncaughtError("multipleResolves", reason),
    );
    process.on("rejectionHandled", (reason: Error) =>
      this.logUncaughtError("rejectionHandled", reason),
    );
    process.on("uncaughtException", (reason: Error) =>
      this.logUncaughtError("uncaughtException", reason),
    );
    this.disposeCommands();
    return this;
  }

  public async getBean(id: string): Promise<any> {
    return this.container.get(id);
  }

  public port(): number {
    if (this.server) {
      return this.server.port();
    }
    return null;
  }

  public async tearDown(): Promise<void> {
    if (this.server) {
      await this.server.close();
    }
    await this.container.close();
  }

  private async shutdownGracefully(event: string) {
    if (await this.container.has("logger")) {
      const logger = await this.container.get("rootLogger");
      logger.info(`Received ${event} event. Shutdown in progress...`);
    } else {
      console.log(`Received ${event} event. Shutdown in progress...`);
    }
    this.tearDown()
      .then(() => process.exit(0))
      .catch((error: Error) => {
        console.error("Shutdown failed", error);
        process.exit(1);
      });
  }

  private async logUncaughtError(event: string, reason: Error) {
    if (await this.container.has("rootLogger")) {
      const logger = await this.container.get("rootLogger");
      logger.error(`Caught ${event} event:`, reason);
    } else {
      console.error(`Caught ${event} event:`, reason);
    }
    this.tearDown()
      .then(() => process.exit(0))
      .catch((error: Error) => {
        console.error("Shutdown failed", error);
        process.exit(1);
      });
  }

  private disposeCommands(): void {
    this.serverCommands = null;
    this.serverOptionCommands = null;
    this.containerCommands = null;
  }
}

export function revane(): Revane {
  return new Revane();
}

export {
  BeanDefinition,
  Loader,
  XmlFileLoader,
  JsonFileLoader,
  RegexFilter,
  LoaderOptions,
  Repository,
  Service,
  Component,
  Controller,
  ControllerAdvice,
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
  Body,
  Response,
  RevaneResponse,
  RevaneRequest,
  Header,
  Headers,
  Log,
  Configuration,
  ConfigurationProperties,
  ApplicationContext,
  ConditionalOnMissingBean,
  Scheduled,
  Scheduler,
  ErrorHandler,
  ResponseStatus,
  Logger,
  PostConstruct,
  PreDestroy,
  RevaneConfiguration,
};

export default Revane;

function applicationName(): string {
  const oldPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack as any;
  Error.prepareStackTrace = oldPrepareStackTrace;

  if (stack != null && typeof stack === "object" && stack.length >= 5) {
    const i3 = stack![3];
    if (i3.getFileName().endsWith("Revane.js")) {
      return stack![4]
        ? extractName((stack![4] as any).getFileName())
        : "Application";
    }
  }
  if (stack != null && typeof stack === "object" && stack.length >= 4) {
    const i2 = stack![2];
    if (i2.getFileName().endsWith("Revane.js")) {
      return stack![3]
        ? extractName((stack![3] as any).getFileName())
        : "Application";
    }
  }
  return "Application";
}

function extractName(file: string) {
  const index = file.lastIndexOf("/");
  return file
    .substring(index + 1)
    .replace(".js", "")
    .replace(".mjs", "");
}
