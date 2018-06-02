"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractBean_1 = require("./AbstractBean");
class ValueBean extends AbstractBean_1.default {
    constructor(value) {
        super();
        this.value = value;
    }
    getInstance() {
        return this.value;
    }
}
exports.default = ValueBean;
