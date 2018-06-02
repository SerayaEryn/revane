'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const test = require("tape-catch");
const JsonFileResolver_1 = require("../src/resolvers/JsonFileResolver");
const XmlFileResolver_1 = require("../src/resolvers/XmlFileResolver");
test('should read xml configuration file and register beans', (t) => {
    t.plan(1);
    const file = path.join(__dirname, '../..//testdata/xml/config.xml');
    const xmlFileResolver = new XmlFileResolver_1.default(file);
    return xmlFileResolver.resolve()
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
        ]);
    });
});
test('should read json configuration file and register beans', (t) => {
    t.plan(1);
    const file = path.join(__dirname, '../../testdata/json/config.json');
    const jsonFileResolver = new JsonFileResolver_1.default(file);
    return jsonFileResolver.resolve()
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
        ]);
    });
});
test('should reject on error', (t) => {
    t.plan(1);
    const file = path.join(__dirname, '../../testdata/json/configa.json');
    const jsonFileResolver = new JsonFileResolver_1.default(file);
    return jsonFileResolver.resolve()
        .catch((err) => {
        t.ok(err);
    });
});
test('should reject on error', t => {
    t.plan(1);
    const file = path.join(__dirname, '../../testdata/json/configa.json');
    const xmlFileResolver = new XmlFileResolver_1.default(file);
    return xmlFileResolver.resolve()
        .catch((err) => {
        t.ok(err);
    });
});
