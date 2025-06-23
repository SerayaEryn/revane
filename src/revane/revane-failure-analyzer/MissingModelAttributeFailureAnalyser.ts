import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";
import { REV_ERR_MISSING_MODEL_ATTRIBUTE_CONVERTER } from "revane-fastify";

export class MissingModelAttributeFailureAnalyser implements FailureAnalyzer {
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const name = cause["name"];
    return new FailureAnalysis(
      `ApplicationContext failed to start. There is no ModelAttribute ` +
        `Converter defined for the ModelAttribute with name '${name}'.`,
      `Define a ModelAttribute Converter with name '${name}'.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return cause.code === REV_ERR_MISSING_MODEL_ATTRIBUTE_CONVERTER;
  }
}
