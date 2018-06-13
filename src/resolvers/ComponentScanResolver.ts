'use strict';

import * as flat from 'array.prototype.flat';
import BeanDefinition from '../BeanDefinition';
import Filter from './Filter';
import RegexFilter from './RegexFilter';
import Resolver from './Resolver';

import * as recursiveReaddir from 'recursive-readdir';
import Options from '../Options';

const filterByType = {
  regex: RegexFilter
};

export default class ComponentScanResolver implements Resolver {
  private basePackage: string;
  private includeFilters: any[];
  private excludeFilters: any[];

  constructor(options: Options) {
    this.basePackage = options.basePackage;
    this.includeFilters = convert(options.includeFilters || []);
    this.excludeFilters = convert(options.excludeFilters || []);
  }

  public resolve(): Promise<BeanDefinition[]> {
    return recursiveReaddir(this.basePackage)
      .then((files: string[]) => {
        const flattenFiles = flat(files);
        const filteredFiles = filterByJavascriptFiles(flattenFiles);

        const result = [];
        for (const file of filteredFiles) {
          let module1 = getClazz(file);
          const clazz = file.replace(this.basePackage, '.');
          if (module1 && module1.__componentmeta) {
            const beanDefinition = getBeanDefinition(module1, clazz);
            result.push(beanDefinition);
          }
        }
        return this.applyFilters(result);
      });
  }

  private applyFilters(beanDefinitions: BeanDefinition[]): BeanDefinition[] {
    let filtered = beanDefinitions;
    for (const filter of this.includeFilters) {
      filtered = filtered.filter((def) => filter.applies(def));
    }
    for (const filter of this.excludeFilters) {
      filtered = filtered.filter((def) => !filter.applies(def));
    }
    return filtered;
  }
}

function getClazz(file: string) {
  let module1 = require(file);
  if (module1.default)
    return module1.default;
  return module1;
}

function getBeanDefinition(module1, clazz): BeanDefinition {
  const { id, type } = module1.__componentmeta;
  const scope = module1.__componentmeta.scope || 'singleton';
  const dependencies = (module1.__componentmeta.dependencies).map(toReference);
  const beanDefinition = new BeanDefinition(id);
  beanDefinition.class = clazz;
  beanDefinition.properties = dependencies;
  beanDefinition.scope = scope;
  beanDefinition.type = type;
  return beanDefinition;
}

function toReference(id: string) {
  return {
    ref: id
  };
}

function filterByJavascriptFiles(files: string[]): string[] {
  const filteredFiles = [];
  for (const file of files) {
    if (file.endsWith('.js')) {
      filteredFiles.push(file);
    }
  }
  return filteredFiles;
}

function convert(filters): Filter[] {
  return filters.map((filter) => new filterByType[filter.type](filter));
}
