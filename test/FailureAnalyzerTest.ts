import test from "ava";
import { AddressAlreadyInUseFailureAnalyzer } from "../src/revane/revane-failure-analyzer/AddressAlreadyInUseFailureAnalyzer.js";
import { DependencyNotFoundFailureAnalyser } from "../src/revane/revane-failure-analyzer/DependencyNotFoundFailureAnalyser.js";
import { ConflictingBeanDefinitionFailureAnalyzer } from "../src/revane/revane-failure-analyzer/ConflictingBeanDefinitionFailureAnalyzer.js";
import { BeanCreationFailureAnalyzer } from "../src/revane/revane-failure-analyzer/BeanCreationFailureAnalyzer.js";
import { CircularDependecyFailureAnalyzer } from "../src/revane/revane-failure-analyzer/CircularDependecyFailureAnalyzer.js";
import { InvalidScopeFailureAnalyser } from "../src/revane/revane-failure-analyzer/InvalidScopeFailureAnalyser.js";
import { InvalidCronPatternFailureAnalyser } from "../src/revane/revane-failure-analyzer/InvalidCronPatternFailureAnalyser.js";
import { DuplicateModelAttributeFailureAnalyser } from "../src/revane/revane-failure-analyzer/DuplicateModelAttributeFailureAnalyser.js";
import { MissingModelAttributeFailureAnalyser } from "../src/revane/revane-failure-analyzer/MissingModelAttributeFailureAnalyser.js";
import { ConfigKeyTypeMismatchFailureAnalyzer } from "../src/revane/revane-failure-analyzer/ConfigKeyTypeMismatchFailureAnalyzer.js";

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

test("should analyze REV_ERR_DEPENDENCY_REGISTER", async (t) => {
  const error = new Error();
  error["code"] = "REV_ERR_DEPENDENCY_REGISTER";
  error["id"] = "userRepository";

  const analyzer = new BeanCreationFailureAnalyzer();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "ApplicationContext failed to start. Bean with id 'userRepository' encountered a problem during its creation.",
  );
  t.is(
    analysis.action,
    "Consider analyzing the stacktrace for further information.",
  );
});

test("should analyze REV_ERR_CIRCULAR_DEPENDENCY", async (t) => {
  const error = new Error();
  error["code"] = "REV_ERR_CIRCULAR_DEPENDENCY";
  error["ids"] = ["userRepository", "userRepository"];

  const analyzer = new CircularDependecyFailureAnalyzer();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "ApplicationContext failed to start. Bean with id 'userRepository' has a circular dependency on itself (userRepository -> userRepository]).",
  );
  t.is(
    analysis.action,
    "Consider checking the dependencies of the bean with id 'userRepository'.",
  );
});

test("should analyze REV_ERR_INVALID_SCOPE", async (t) => {
  const error = new Error();
  error["code"] = "REV_ERR_INVALID_SCOPE";
  error["id"] = "userRepository";
  error["scope"] = "test";

  const analyzer = new InvalidScopeFailureAnalyser();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "ApplicationContext failed to start. Bean with id 'userRepository' has a invalid @Scope('test') decorator.",
  );
  t.is(
    analysis.action,
    "Consider checking the @Scope decorator of the bean with id 'userRepository'.",
  );
});

test("should analyze REV_ERR_INVALID_CRON_PATTERN_PROVIDED", async (t) => {
  const error = new Error();
  error["code"] = "REV_ERR_INVALID_CRON_PATTERN_PROVIDED";
  error["id"] = "userRepository";
  error["cronPattern"] = "* /2 * * * a";

  const analyzer = new InvalidCronPatternFailureAnalyser();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "ApplicationContext failed to start. Bean with id 'userRepository' has a invalid cron pattern '* /2 * * * a'.",
  );
  t.is(
    analysis.action,
    "Consider checking the cron pattern. Refer to https://github.com/hexagon/croner?tab=readme-ov-file#pattern for details on the cron pattern syntax.",
  );
});

test("should analyze REV_ERR_MISSING_MODEL_ATTRIBUTE_CONVERTER", async (t) => {
  const error = new Error();
  error["code"] = "REV_ERR_MISSING_MODEL_ATTRIBUTE_CONVERTER";
  error["name"] = "userRepository";

  const analyzer = new MissingModelAttributeFailureAnalyser();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "ApplicationContext failed to start. There is no ModelAttribute Converter defined for the ModelAttribute with name 'userRepository'.",
  );
  t.is(
    analysis.action,
    "Define a ModelAttribute Converter with name 'userRepository'.",
  );
});

test("should analyze REV_ERR_DUPLICATE_MODEL_ATTRIBUTE_CONVERTER", async (t) => {
  const error = new Error();
  error["code"] = "REV_ERR_DUPLICATE_MODEL_ATTRIBUTE_CONVERTER";
  error["name"] = "userRepository";

  const analyzer = new DuplicateModelAttributeFailureAnalyser();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "ApplicationContext failed to start. There is more than one ModelAttribute Converter defined for the ModelAttribute with name 'userRepository'.",
  );
  t.is(
    analysis.action,
    "Consider checking all ModelAttribute Converters with name 'userRepository'.",
  );
});

test("should analyze REV_ERR_KEY_TYPE_MISMATCH", async (t) => {
  const error = new Error();
  error["code"] = "REV_ERR_KEY_TYPE_MISMATCH";
  error["key"] = "a.property";
  error["type"] = "string";

  const analyzer = new ConfigKeyTypeMismatchFailureAnalyzer();

  t.true(analyzer.matches(error));
  t.false(analyzer.matches(new Error()));

  const analysis = analyzer.analyze(error);
  t.is(
    analysis.description,
    "ApplicationContext failed to start. The value of the property key 'a.property' is unexpectedly a string.",
  );
  t.is(
    analysis.action,
    "Consider checking the provided value for the property key 'a.property'.",
  );
});
