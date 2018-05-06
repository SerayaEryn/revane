'use strict';

const fileSystem = require('fs');

module.exports = class JsonFileResolver {
  constructor(path) {
    this.path = path;
  }

  resolve() {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(this.path, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }
};
