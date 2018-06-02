'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class RegexFilter {
    constructor(options) {
        this.regex = new RegExp(options.regex);
        this.applies.bind(this);
    }
    applies(entry) {
        return this.regex.test(entry.class);
    }
}
exports.default = RegexFilter;
