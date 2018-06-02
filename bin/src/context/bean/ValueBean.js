'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Bean_1 = require("./Bean");
class ValueBean extends Bean_1.default {
    constructor(value) {
        super();
        this.value = value;
    }
    getInstance() {
        return this.value;
    }
}
exports.default = ValueBean;
