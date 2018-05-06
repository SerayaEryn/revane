'use strict';

const t = require('tap');
const test = t.test;
const JsonFileResolver = require('../lib/resolvers/JsonFileResolver');
const XmlFileResolver = require('../lib/resolvers/XmlFileResolver');

test('should read xml configuration file and register beans', (t) => {
  t.plan(1);

  const path = __dirname + '/testclasses/xml/config.xml';

  const xmlFileResolver = new XmlFileResolver(path);

  return xmlFileResolver.resolve()
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          id: "xml1",
          class: "./testclasses/xml/xml1.js"
        },
        {
          "id": "xml2",
          "class": "./testclasses/xml/xml2",
          "properties": [{
            "ref": "xml1"
          }]
        },
        {
          "id": "xml3",
          "class": "./testclasses/xml/xml3",
          "properties": [
            {"ref": "xml1"},
            {"ref": "xml2"}
          ]
        }
      ])
    });
});

test('should read json configuration file and register beans', (t) => {
  t.plan(1);

  const path = __dirname + '/testclasses/json/config.json';

  const jsonFileResolver = new JsonFileResolver(path);

  return jsonFileResolver.resolve()
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          "id": "json1",
          "class": "./testclasses/json/json1.js"
        },
        {
          "id": "json2",
          "class": "./testclasses/json/json2",
          "properties": [{
            "ref": "json1"
          }]
        }
      ])
    });
});

test('should reject on error', (t) => {
  t.plan(1);

  const path = __dirname + '/testclasses/json/configa.json';

  const jsonFileResolver = new JsonFileResolver(path);

  return jsonFileResolver.resolve()
    .catch((err) => {
      t.ok(err);
    });
});

test('should reject on error', t => {
  t.plan(1);

  const path = __dirname + '/testclasses/json/configa.json';
  
  const xmlFileResolver = new XmlFileResolver(path);
  
  return xmlFileResolver.resolve()
    .catch((err) => {
      t.ok(err);
    });
});