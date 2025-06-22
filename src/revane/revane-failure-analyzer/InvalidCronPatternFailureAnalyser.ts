import { errorCodes } from "revane-ioc";
import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";

export class InvalidCronPatternFailureAnalyser implements FailureAnalyzer {
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const id = cause["id"];
    const cronPattern = cause["cronPattern"];
    return new FailureAnalysis(
      `ApplicationContext failed to start. Bean with id '${id}' has a invalid ` +
        `cron pattern '${cronPattern}'.`,
      `Consider checking the cron pattern. Refer to ` +
        `https://github.com/hexagon/croner?tab=readme-ov-file#pattern for ` +
        `details on the cron pattern syntax.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return cause.code === errorCodes.REV_ERR_INVALID_CRON_PATTERN_PROVIDED;
  }
}
