'use strict';

import * as fileSystem from 'fs';

export default class JsonFileResolver {
  private path: string;
  constructor(path: string) {
    this.path = path;
  }

  public resolve(): Promise<any> {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(this.path, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(data.toString()));
        }
      });
    });
  }
}
