import { errorCodes } from "revane-ioc";
import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";

export class DependencyNotFoundFailureAnalyser implements FailureAnalyzer {
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const id = cause["id"];
    const parentId = cause["parentId"];
    return new FailureAnalysis(
      `ApplicationContext failed to start. Bean with id '${parentId}' ` +
        `required a bean with id ${id} that could not be found.`,
      `Consider providing a bean with id '${id}'.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return cause.code === errorCodes.REV_ERR_DEPENDENCY_NOT_FOUND;
  }
}
