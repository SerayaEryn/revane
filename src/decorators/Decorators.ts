'use strict';

import Component from './Component';
import Scope from './Scope';

const RepositoryInstance = new Component('repository');
const ServiceInstance = new Component('service');
const ComponentInstance = new Component('component');
const ControllerInstance = new Component('controller');
const ScopeInstance = new Scope();

const RepositoryDecorator = RepositoryInstance.create.bind(RepositoryInstance);
const ServiceDecorator = ServiceInstance.create.bind(ServiceInstance);
const ComponentDecorator = ComponentInstance.create.bind(ComponentInstance);
const ControllerDecorator = ControllerInstance.create.bind(ControllerInstance);
const ScopeDecorator = ScopeInstance.create.bind(ScopeInstance);

export {
  RepositoryDecorator as Repository,
  ServiceDecorator as Service,
  ComponentDecorator as Component,
  ControllerDecorator as Controller,
  ScopeDecorator as Scope
};
