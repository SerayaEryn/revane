import { FailureAnalysis } from "./FailureAnalysis.js";
import { FailureAnalyzer } from "./FailureAnalyzer.js";
import { errorCodes } from "revane-fastify";

export class DuplicateModelAttributeFailureAnalyser implements FailureAnalyzer {
  analyze(cause: NodeJS.ErrnoException): FailureAnalysis {
    const name = cause["name"];
    return new FailureAnalysis(
      `ApplicationContext failed to start. There is more than one ModelAttribute Converter defined for the ModelAttribute with name '${name}'.`,
      `Consider checking all ModelAttribute Converters with name '${name}'.`,
      cause,
    );
  }

  matches(cause: NodeJS.ErrnoException): boolean {
    return (
      cause.code === errorCodes.REV_ERR_DUPLICATE_MODEL_ATTRIBUTE_CONVERTER
    );
  }
}
