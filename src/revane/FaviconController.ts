import { Get } from "revane-fastify";
import {
  Controller,
  RevaneConfiguration,
  ConditionalOnProperty,
  ConditionalOnResource,
} from "revane-ioc";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

@Controller
@ConditionalOnProperty("revane.favicon.enabled", true)
@ConditionalOnResource("./static/favicon.ico")
export default class FaviconController {
  #basePackage;

  constructor(configuration: RevaneConfiguration) {
    console.log("TEST");
    this.#basePackage = configuration.getString("revane.basePackage");
  }

  @Get("/favicon.ico")
  public async favicon() {
    return await readFile(join(this.#basePackage, "./static/favicon.ico"));
  }
}
