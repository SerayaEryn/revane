'use strict'

import * as fileSystem from 'fs'
import BeanDefinition from '../BeanDefinition'
import Resolver from './Resolver'

export default class JsonFileResolver implements Resolver {
  private path: string
  constructor (path: string) {
    this.path = path
  }

  public resolve (): Promise<BeanDefinition[]> {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(this.path, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data.toString()))
        }
      })
    })
  }
}
