import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";

export class AddressAlreadyInUseFailureAnalyzer implements FailureAnalyzer {
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const port = cause["port"];
    return new FailureAnalysis(
      `Web server failed to start. Port ${port} was already in use.`,
      `Identify and stop the process that's listing on port ${port} or ` +
        `configure this application to listen on another port.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return cause.code === "EADDRINUSE";
  }
}
