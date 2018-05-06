'use strict';

var esprima = require('esprima');
const Decorator = require('./Decorator');

class Component extends Decorator {
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
      id,
      dependencies,
      type: this.type
    };
    return this._appendMetaData(Class, value);
  }
}

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

module.exports = Component;
