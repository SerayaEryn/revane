import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";

export class CircularDependecyFailureAnalyzer implements FailureAnalyzer {
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const ids = cause["ids"] ?? [];
    return new FailureAnalysis(
      `ApplicationContext failed to start. Bean with id '${ids[0]}' has a circular dependency on itself (${ids.join(" -> ")}]).`,
      `Consider checking the dependencies of the bean with id '${ids[0]}'.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return cause.code === "REV_ERR_CIRCULAR_DEPENDENCY";
  }
}
