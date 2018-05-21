'use strict';

const BeanResolverRegistry = require('./BeanResolverRegistry');
const ComponentScanResolver = require('./resolvers/ComponentScanResolver');
const JsonFileResolver = require('./resolvers/JsonFileResolver');
const XmlFileResolver = require('./resolvers/XmlFileResolver');
const UnknownEndingError = require('./UnknownEndingError');

const fileResolvers = {
  '.json': JsonFileResolver,
  '.xml': XmlFileResolver
};
const supportedFileEndings = [
  '.json',
  '.xml'
];

function getBeanDefinitions(options) {
  try {
    const beanResolverRegistry = getBeanResolverRegistry(options);
    return beanResolverRegistry.get();
  } catch (err) {
    return Promise.reject(err);
  }
}

function getBeanResolverRegistry(options) {
  const files = options.configurationFiles || [];
  const beanResolverRegistry = new BeanResolverRegistry();
  for (const file of files) {
    beanResolverRegistry.register(getResolver(file));
  }
  if (options.componentScan !== false) {
    beanResolverRegistry.register(new ComponentScanResolver(options));
  }
  return beanResolverRegistry;
}

function getResolver(file) {
  const ending = getEnding(file);
  return new fileResolvers[ending](file);
}

function getEnding(file) {
  for (const ending of supportedFileEndings) {
    if (file.endsWith(ending)) {
      return ending;
    }
  }
  throw new UnknownEndingError();
}

module.exports = {
  getBeanDefinitions
};
