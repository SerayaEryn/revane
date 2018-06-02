'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fastXmlParser = require("fast-xml-parser");
const fileSystem = require("fs");
const BeanDefinition_1 = require("../BeanDefinition");
const options = {
    allowBooleanAttributes: false,
    attrNodeName: 'attr',
    attributeNamePrefix: '',
    ignoreAttributes: false,
    ignoreNameSpace: false,
    parseAttributeValue: false,
    parseNodeValue: true
};
class XmlFileResolver {
    constructor(path) {
        this.path = path;
    }
    resolve() {
        return new Promise((resolve, reject) => {
            fileSystem.readFile(this.path, (error, data) => {
                if (error) {
                    reject(error);
                }
                else {
                    const result = fastXmlParser.parse(data.toString(), options);
                    let beanDefinitions;
                    if (Array.isArray(result.beans.bean)) {
                        beanDefinitions = result.beans.bean.map(toBeanDefinition);
                    }
                    else {
                        beanDefinitions = [toBeanDefinition(result.beans.bean)];
                    }
                    resolve(beanDefinitions);
                }
            });
        });
    }
}
exports.default = XmlFileResolver;
function toBeanDefinition(bean) {
    const beanDefinition = new BeanDefinition_1.default(bean.attr.id);
    beanDefinition.class = bean.attr.class;
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
            properties = ref.map(toReference);
        }
        else {
            properties = [{ ref: ref.attr.bean }];
        }
    }
    return properties;
}
function toReference(ref) {
    return { ref: ref.attr.bean };
}
