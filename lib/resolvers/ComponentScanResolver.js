'use strict';

const recursiveReaddir = require('recursive-readdir');

module.exports = class ComponentScanResolver {
  constructor(basePackage) {
    this.basePackage = basePackage;
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
        return result;
      });
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
