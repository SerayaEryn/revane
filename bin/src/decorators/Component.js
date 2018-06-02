'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const esprima = require("esprima");
const Decorator_1 = require("./Decorator");
class Component extends Decorator_1.default {
    constructor(type) {
        super();
        this.type = type;
    }
    define(Class) {
        const opts = this.options || {};
        let id = opts.id;
        const tree = getSyntaxTree(Class);
        if (!id) {
            id = getId(tree);
        }
        const dependencies = getDependencies(tree);
        const value = {
            dependencies,
            id,
            type: this.type
        };
        return this.appendMetaData(Class, value);
    }
}
exports.default = Component;
function getSyntaxTree(Class) {
    const functionAsString = Class.toString();
    return esprima.parse(functionAsString);
}
function getId(tree) {
    const className = tree.body[0].id.name;
    return className.substring(0, 1).toLowerCase() + className.substring(1);
}
function getDependencies(tree) {
    const functions = tree.body[0].body.body;
    for (const funktion of functions) {
        if (isConstructor(funktion)) {
            return funktion.value.params.map((param) => param.name);
        }
    }
    return [];
}
function isConstructor(funktion) {
    return funktion.key && funktion.key.name === 'constructor';
}
