'use strict';

const fileSystem = require('fs');
const fastXmlParser = require('fast-xml-parser');

const options = {
  attributeNamePrefix: '',
  attrNodeName: 'attr',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false
};

module.exports = class XmlFileResolver {
  constructor(path) {
    this.path = path;
  }

  resolve() {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(this.path, (error, data) => {
        if (error) {
          reject(error);
        } else {
          const result = fastXmlParser.parse(data.toString(), options);
          let beanDefinitions;
          if (Array.isArray(result.beans.bean)) {
            beanDefinitions = result.beans.bean.map(toBeanDefinition);
          } else {
            beanDefinitions = [toBeanDefinition(result.beans.bean)];
          }
          resolve(beanDefinitions);
        }
      });
    });
  }
};

function toBeanDefinition(bean) {
  const beanDefinition = {
    class: bean.attr.class,
    id: bean.attr.id
  };
  if (bean.attr.type) {
    beanDefinition.type = bean.attr.type;
  }
  const ref = bean.ref;
  const properties = getProperties(ref);
  if (properties && properties.length > 0) {
    beanDefinition.properties = properties;
  }
  return beanDefinition;
}

function getProperties(ref) {
  let properties;
  if (ref) {
    if (Array.isArray(ref)) {
      properties = ref.map((ref) => {
        return { ref: ref.attr.bean };
      });
    } else {
      properties = [{ ref: ref.attr.bean }];
    }
  }
  return properties;
}
