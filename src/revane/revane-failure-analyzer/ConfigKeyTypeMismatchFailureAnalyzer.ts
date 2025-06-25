import { errorCodes } from "revane-ioc";
import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";

export class ConfigKeyTypeMismatchFailureAnalyzer implements FailureAnalyzer {
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const key = cause["key"];
    const type = cause["type"];
    return new FailureAnalysis(
      `ApplicationContext failed to start. The value of the property ` +
        `key '${key}' is unexpectedly a ${type}.`,
      `Consider checking the provided value for the property key '${key}'.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return cause.code === errorCodes.REV_ERR_KEY_TYPE_MISMATCH;
  }
}
