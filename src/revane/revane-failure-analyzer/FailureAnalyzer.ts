import { FailureAnalysis } from "./FailureAnalysis.js";

export interface FailureAnalyzer {
  analyze(cause: Error): FailureAnalysis;
  matches(cause: Error): boolean;
}
