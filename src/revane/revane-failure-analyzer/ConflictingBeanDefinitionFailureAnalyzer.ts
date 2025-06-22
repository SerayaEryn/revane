import { errorCodes } from "revane-ioc";
import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";

export class ConflictingBeanDefinitionFailureAnalyzer
  implements FailureAnalyzer
{
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const id = cause["id"];
    return new FailureAnalysis(
      `ApplicationContext failed to start. Bean with id '${id}' ` +
        `conflicts with existing bean definition of same id.`,
      `Consider renaming the bean with id '${id}'.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return cause.code === errorCodes.REV_ERR_DEFINED_TWICE;
  }
}
