'use strict'

import * as fastXmlParser from 'fast-xml-parser'
import * as fileSystem from 'fs'
import BeanDefinition from '../BeanDefinition'
import Resolver from './Resolver'

const options = {
  allowBooleanAttributes: false,
  attrNodeName: 'attr',
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  parseAttributeValue: false,
  parseNodeValue: true
}

export default class XmlFileResolver implements Resolver {
  private path: string

  constructor (path) {
    this.path = path
  }

  public resolve (): Promise<BeanDefinition[]> {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(this.path, (error, data) => {
        if (error) {
          reject(error)
        } else {
          const result = fastXmlParser.parse(data.toString(), options)
          let beanDefinitions
          if (Array.isArray(result.beans.bean)) {
            beanDefinitions = result.beans.bean.map(toBeanDefinition)
          } else {
            beanDefinitions = [toBeanDefinition(result.beans.bean)]
          }
          resolve(beanDefinitions)
        }
      })
    })
  }
}

function toBeanDefinition (bean): BeanDefinition {
  const beanDefinition = new BeanDefinition(bean.attr.id)
  beanDefinition.class = bean.attr.class
  if (bean.attr.type) {
    beanDefinition.type = bean.attr.type
  }
  const ref = bean.ref
  const properties = getProperties(ref)
  if (properties && properties.length > 0) {
    beanDefinition.properties = properties
  }
  return beanDefinition
}

function getProperties (ref) {
  let properties
  if (ref) {
    if (Array.isArray(ref)) {
      properties = ref.map(toReference)
    } else {
      properties = [{ ref: ref.attr.bean }]
    }
  }
  return properties
}

function toReference (ref) {
  return { ref: ref.attr.bean }
}
