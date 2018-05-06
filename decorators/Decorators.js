'use strict';

const Component = require('./Component');
const Scope = require('./Scope');

const Repository = new Component('repository');
const Service = new Component('service');
const Component1 = new Component('component');
const Controller = new Component('controller');
const Scope1 = new Scope();

module.exports.Repository = Repository.create.bind(Repository);
module.exports.Service = Service.create.bind(Service);
module.exports.Component = Component1.create.bind(Component1);
module.exports.Controller = Controller.create.bind(Controller);
module.exports.Scope = Scope1.create.bind(Scope1);
