import * as path from 'path'
import * as test from 'tape-catch'
import JsonFileLoader from '../src/resolvers/JsonFileLoader'
import XmlFileLoader from '../src/resolvers/XmlFileLoader'

test('should read xml configuration file and register beans', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../testdata/xml/config.xml')

  const xmlFileResolver = new XmlFileLoader({ file })

  return xmlFileResolver.load()
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          id: 'xml1',
          class: './xml/xml1.js'
        },
        {
          id: 'xml2',
          class: './xml/xml2',
          properties: [{
            ref: 'xml1'
          }]
        },
        {
          id: 'xml3',
          class: './xml/xml3',
          properties: [
            { ref: 'xml1' },
            { ref: 'xml2' }
          ]
        }
      ])
    })
})

test('should read json configuration file and register beans', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../testdata/json/config.json')

  const jsonFileResolver = new JsonFileLoader({ file })

  return jsonFileResolver.load()
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          id: 'json1',
          class: './json/json1.js'
        },
        {
          id: 'json2',
          class: './json/json2',
          properties: [{
            ref: 'json1'
          }]
        }
      ])
    })
})

test('should reject on error', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../testdata/json/configa.json')

  const jsonFileResolver = new JsonFileLoader({ file })

  return jsonFileResolver.load()
    .catch((err) => {
      t.ok(err)
    })
})

test('should reject on error', t => {
  t.plan(1)

  const file = path.join(__dirname, '../../testdata/json/configa.json')

  const xmlFileResolver = new XmlFileLoader({ file })

  return xmlFileResolver.load()
    .catch((err) => {
      t.ok(err)
    })
})

test('isRelevant', t => {
  t.plan(4)

  t.ok(XmlFileLoader.isRelevant({ file: '.xml' }))
  t.notOk(XmlFileLoader.isRelevant({ file: '.json' }))
  t.ok(JsonFileLoader.isRelevant({ file: '.json' }))
  t.notOk(JsonFileLoader.isRelevant({ file: '.xml' }))
})
