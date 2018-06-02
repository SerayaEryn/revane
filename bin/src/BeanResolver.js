"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BeanResolverRegistry_1 = require("./BeanResolverRegistry");
const ComponentScanResolver_1 = require("./resolvers/ComponentScanResolver");
const JsonFileResolver_1 = require("./resolvers/JsonFileResolver");
const XmlFileResolver_1 = require("./resolvers/XmlFileResolver");
const UnknownEndingError_1 = require("./UnknownEndingError");
const fileResolvers = {
    '.json': JsonFileResolver_1.default,
    '.xml': XmlFileResolver_1.default
};
const supportedFileEndings = [
    '.json',
    '.xml'
];
function getBeanDefinitions(options) {
    try {
        const beanResolverRegistry = getBeanResolverRegistry(options);
        return beanResolverRegistry.get();
    }
    catch (err) {
        return Promise.reject(err);
    }
}
function getBeanResolverRegistry(options) {
    const files = options.configurationFiles || [];
    const beanResolverRegistry = new BeanResolverRegistry_1.default();
    for (const file of files) {
        beanResolverRegistry.register(getResolver(file));
    }
    if (options.componentScan !== false) {
        beanResolverRegistry.register(new ComponentScanResolver_1.default(options));
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
    throw new UnknownEndingError_1.default();
}
exports.default = { getBeanDefinitions };
