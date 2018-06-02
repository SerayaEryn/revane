'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fileSystem = require("fs");
class JsonFileResolver {
    constructor(path) {
        this.path = path;
    }
    resolve() {
        return new Promise((resolve, reject) => {
            fileSystem.readFile(this.path, (error, data) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(JSON.parse(data.toString()));
                }
            });
        });
    }
}
exports.default = JsonFileResolver;
