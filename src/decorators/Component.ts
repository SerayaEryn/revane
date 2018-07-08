'use strict';

import * as esprima from 'esprima';
import 'reflect-metadata';
import Decorator from './Decorator';

export default class Component extends Decorator {
  public type;

  constructor(type) {
    super();
    this.type = type;
  }

  public define(Class) {
    let opts;
    let id;
    if (typeof this.options === 'string') {
      id = this.options;
      opts = {};
    } else {
      opts = this.options || {};
      id = opts.id;
    }

    const tree = getSyntaxTree(Class);

    if (!id) {
      id = getId(tree);
    }
    const dependencies = getDependencies(tree);
    Reflect.defineMetadata('dependencies', dependencies, Class);
    Reflect.defineMetadata('id', id, Class);
    Reflect.defineMetadata('type', this.type, Class);
    return Class;
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
