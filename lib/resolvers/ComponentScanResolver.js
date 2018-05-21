'use strict';

const recursiveReaddir = require('recursive-readdir');
const RegexFilter = require('./RegexFilter');

const filterByType = {
  regex: RegexFilter
};

module.exports = class ComponentScanResolver {
  constructor(options) {
    this.basePackage = options.basePackage;
    this.includeFilters = convert(options.includeFilters || []);
    this.excludeFilters = convert(options.excludeFilters || []);
  }

  resolve() {
    return recursiveReaddir(this.basePackage)
      .then((files) => {
        const flattenFiles = [].concat.apply([], files);
        const filteredFiles = filterByJavascriptFiles(flattenFiles);

        const result = [];
        for (const file of filteredFiles) {
          const module1 = require(file);
          const clazz = file.replace(this.basePackage, '.');
          if (module1 && module1.__componentmeta) {
            const beanDefinition = getBeanDefinition(module1, clazz);
            result.push(beanDefinition);
          }
        }
        return this._applyFilters(result);
      });
  }

  _applyFilters(beanDefinitions) {
    let filtered = beanDefinitions;
    for (const filter of this.includeFilters) {
      filtered = filtered.filter((def) => filter.applies(def));
    }
    for (const filter of this.excludeFilters) {
      filtered = filtered.filter((def) => !filter.applies(def));
    }
    return filtered;
  }
};

function getBeanDefinition(module1, clazz) {
  const { id, type } = module1.__componentmeta;
  const scope = module1.__componentmeta.scope || 'singleton';
  var dependencies = (module1.__componentmeta.dependencies).map((id) => {
    return {
      ref: id
    };
  });
  const beanDefinition = {
    id,
    scope,
    class: clazz,
    properties: dependencies,
    type
  };
  return beanDefinition;
}

function filterByJavascriptFiles(files) {
  const filteredFiles = [];
  for (const file of files) {
    if (file.endsWith('.js')) {
      filteredFiles.push(file);
    }
  }
  return filteredFiles;
}

function convert(filters) {
  return filters.map((filter) => new filterByType[filter.type](filter));
}
