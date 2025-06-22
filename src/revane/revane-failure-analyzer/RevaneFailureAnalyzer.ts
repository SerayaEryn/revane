import { Logger } from "revane-ioc";
import { FailureAnalyzer } from "./FailureAnalyzer.js";
import { FailureAnalysis } from "./FailureAnalysis.js";
import { AddressAlreadyInUseFailureAnalyzer } from "./AddressAlreadyInUseFailureAnalyzer.js";
import { DependencyNotFoundFailureAnalyser } from "./DependencyNotFoundFailureAnalyser.js";
import { ConflictingBeanDefinitionFailureAnalyzer } from "./ConflictingBeanDefinitionFailureAnalyzer.js";
import { BeanCreationFailureAnalyzer } from "./BeanCreationFailureAnalyzer.js";
import { CircularDependecyFailureAnalyzer } from "./CircularDependecyFailureAnalyzer.js";

export { FailureAnalyzer };

export class RevaneFailureAnalyzer {
  #logger: Logger | null;
  #analyzers: FailureAnalyzer[] = [
    new AddressAlreadyInUseFailureAnalyzer(),
    new DependencyNotFoundFailureAnalyser(),
    new ConflictingBeanDefinitionFailureAnalyzer(),
    new BeanCreationFailureAnalyzer(),
    new CircularDependecyFailureAnalyzer(),
  ];

  constructor(logger: Logger | null) {
    this.#logger = logger;
  }

  addAnalyzer(analyzer: FailureAnalyzer) {
    this.#analyzers.push(analyzer);
  }

  analyzeFailure(cause: Error) {
    for (const analyzer of this.#analyzers) {
      if (analyzer.matches(cause)) {
        this.#log(analyzer.analyze(cause));
        return;
      }
    }
    this.#fallbackLog(cause);
  }

  #log(analysis: FailureAnalysis) {
    const message = `APPLICATION FAILED TO START\n\nDescription:\n\n${analysis.description}\n\nAction:\n\n${analysis.action}\n\n`;
    if (this.#logger == null) {
      console.error(message, analysis.cause);
    } else {
      this.#logger.fatal(message, analysis.cause);
    }
  }

  #fallbackLog(cause: Error) {
    const message = "APPLICATION FAILED TO START\n\n";
    if (this.#logger == null) {
      console.error(message, cause);
    } else {
      this.#logger.fatal(message, cause);
    }
  }
}
