import test from "ava";
import { AddressAlreadyInUseFailureAnalyzer } from "../src/revane/revane-failure-analyzer/AddressAlreadyInUseFailureAnalyzer.js";
import { DependencyNotFoundFailureAnalyser } from "../src/revane/revane-failure-analyzer/DependencyNotFoundFailureAnalyser.js";
import { ConflictingBeanDefinitionFailureAnalyzer } from "../src/revane/revane-failure-analyzer/ConflictingBeanDefinitionFailureAnalyzer.js";

test("should analyze EADDRINUSE", async (t) => {
  const error = new Error();
  error["code"] = "EADDRINUSE";
  error["port"] = 42;

  const analyzer = new AddressAlreadyInUseFailureAnalyzer();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "Web server failed to start. Port 42 was already in use.",
  );
  t.is(
    analysis.action,
    "Identify and stop the process that's listing on port 42 or configure this application to listen on another port.",
  );
});

test("should analyze REV_ERR_DEPENDENCY_NOT_FOUND", async (t) => {
  const error = new Error();
  error["code"] = "REV_ERR_DEPENDENCY_NOT_FOUND";
  error["id"] = "userRepository";
  error["parentId"] = "userService";

  const analyzer = new DependencyNotFoundFailureAnalyser();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "ApplicationContext failed to start. Bean with id 'userService' required a bean with id userRepository that could not be found.",
  );
  t.is(analysis.action, "Consider providing a bean with id 'userRepository'.");
});

test("should analyze REV_ERR_DEFINED_TWICE", async (t) => {
  const error = new Error();
  error["code"] = "REV_ERR_DEFINED_TWICE";
  error["id"] = "userRepository";

  const analyzer = new ConflictingBeanDefinitionFailureAnalyzer();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "ApplicationContext failed to start. Bean with id 'userRepository' conflicts with existing bean definition of same id.",
  );
  t.is(analysis.action, "Consider renaming the bean with id 'userRepository'.");
});
