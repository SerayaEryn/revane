import RevaneIOC, {
  RegexFilter,
  Options,
  LoggingExtension,
  SchedulingExtension,
  BeanFactoryExtension,
  ComponentScanExtension,
  ComponentScanLoaderOptions,
  XmlFileLoaderOptions,
  JsonFileLoaderOptions,
} from "revane-ioc";
import { join } from "path";
import { log } from "console";

export class ContainerBuilder {
  private commands;
  private options: Options;
  private basePackagePath: string;

  constructor(commands) {
    this.basePackagePath = process.cwd();
    this.options = new Options(process.cwd(), [
      new ComponentScanExtension(),
      new BeanFactoryExtension(),
      new LoggingExtension(),
      new SchedulingExtension(null),
    ]);
    this.commands = commands;
  }

  private componentScan(
    path: string,
    excludeFilters?: RegexFilter[],
    includeFilters?: RegexFilter[],
  ): void {
    this.#ensureLoaderOptions();
    this.options.loaderOptions.push(
      new ComponentScanLoaderOptions(
        this.absolutePath(path),
        excludeFilters,
        includeFilters,
      ),
    );
  }

  private disableAutoConfiguration(): void {
    this.options.autoConfiguration = false;
  }

  private basePackage(path: string): void {
    this.basePackagePath = path;
    this.options.basePackage = path;
  }

  private xmlFile(file: string): void {
    this.#ensureLoaderOptions();
    this.options.loaderOptions.push(
      new XmlFileLoaderOptions(this.absolutePath(file)),
    );
  }

  private jsonFile(file: string): void {
    this.#ensureLoaderOptions();
    this.options.loaderOptions.push(
      new JsonFileLoaderOptions(this.absolutePath(file)),
    );
  }

  private noRedefinition(noRedefinition?: boolean): void {
    this.options.noRedefinition = noRedefinition;
  }

  private configurationDir(path?: string): void {
    this.options.configuration = {
      directory: path,
      required: false,
      disabled: false,
    };
  }

  async build(): Promise<RevaneIOC> {
    const startedAt = Date.now();
    for (const command of this.commands) {
      this[command.type](...command.args);
    }
    if (this.options.autoConfiguration == null) {
      this.options.autoConfiguration = true;
    }
    const container = new RevaneIOC(this.options);
    await container.initialize();
    const finishedAt = Date.now();
    const logger = await container.get("rootLogger");
    if (logger != null) {
      const duration = finishedAt - startedAt;
      logger.info(
        `Root ApplicationContext: initialization completed in ${duration} ms`,
      );
    }
    return container;
  }

  #ensureLoaderOptions(): void {
    if (!this.options.loaderOptions) {
      this.options.loaderOptions = [];
    }
  }

  private absolutePath(path: string): string {
    if (path.startsWith(".")) {
      return join(this.basePackagePath, path);
    }
    return path;
  }
}
