import { errorCodes } from "revane-ioc";
import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";

export class InvalidScopeFailureAnalyser implements FailureAnalyzer {
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const id = cause["id"];
    const scope = cause["scope"];
    return new FailureAnalysis(
      `ApplicationContext failed to start. Bean with id '${id}' has a invalid ` +
        `@Scope('${scope}') decorator.`,
      `Consider checking the @Scope decorator of the bean with id '${id}'.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return cause.code === errorCodes.REV_ERR_INVALID_SCOPE;
  }
}
