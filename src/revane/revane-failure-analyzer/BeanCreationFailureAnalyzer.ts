import { errorCodes } from "revane-ioc";
import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";

export class BeanCreationFailureAnalyzer implements FailureAnalyzer {
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const id = cause["id"];
    return new FailureAnalysis(
      `ApplicationContext failed to start. Bean with id '${id}' ` +
        `encountered a problem during its creation.`,
      `Consider analyzing the stacktrace for further information.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return cause.code == errorCodes.REV_ERR_DEPENDENCY_REGISTER;
  }
}
