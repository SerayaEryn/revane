import RevaneIOC, { RegexFilter } from 'revane-ioc'
import { join } from 'path'

export class ContainerBuilder {
  private commands
  private options: any = {
    configuration: {}
  }
  private basePackagePath: string

  constructor (commands) {
    this.basePackagePath = process.cwd()
    this.options.basePackage = process.cwd()
    this.commands = commands
  }

  private componentScan (path: string, excludeFilters?: RegexFilter[], includeFilters?: RegexFilter[]): void {
    this.ensureLoaderOptions()
    this.options.loaderOptions.push({
      componentScan: true,
      basePackage: this.absolutePath(path),
      excludeFilters,
      includeFilters
    })
  }

  private disableAutoConfiguration (): void {
    this.options.autoConfiguration = false
  }

  private basePackage (path: string): void {
    this.basePackagePath = path
    this.options.basePackage = path
  }

  private xmlFile (file: string): void {
    this.ensureLoaderOptions()
    this.options.loaderOptions.push({
      file: this.absolutePath(file)
    })
  }

  private jsonFile (file: string): void {
    this.ensureLoaderOptions()
    this.options.loaderOptions.push({
      file: this.absolutePath(file)
    })
  }

  private noRedefinition (noRedefinition?: boolean): void {
    this.options.noRedefinition = noRedefinition
  }

  async build (): Promise<RevaneIOC> {
    for (const command of this.commands) {
      this[command.type](...command.args)
    }
    if (this.options.autoConfiguration == null) {
      this.options.autoConfiguration = true
    }
    const container = new RevaneIOC(this.options)
    await container.initialize()
    return container
  }

  private ensureLoaderOptions (): void {
    if (!this.options.loaderOptions) {
      this.options.loaderOptions = []
    }
  }

  private absolutePath (path: string): string {
    if (path.startsWith('.')) {
      return join(this.basePackagePath, path)
    }
    return path
  }
}
