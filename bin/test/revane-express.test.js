'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const test = require("tape-catch");
const revaneExpress_1 = require("../src/express/revaneExpress");
const revane_1 = require("../src/revane");
test('should use router', (t) => {
    t.plan(2);
    const options = {
        basePackage: path.join(__dirname, '../../testdata'),
        configurationFiles: [
            path.join(__dirname, '../../testdata/json/config4.json')
        ],
        componentScan: false
    };
    const revane = new revane_1.default(options);
    return revane.initialize()
        .then(() => {
        t.pass();
        const app = new revaneExpress_1.default(revane);
        return app.use('test12')
            .use('test14')
            .useControllers('test13')
            .listen()
            .then(() => {
            t.ok(app.server.get('port'));
            app.server.get('server').close();
        });
    });
});
test('should reject with error', (t) => {
    t.plan(2);
    const options = {
        basePackage: path.join(__dirname, '../../testdata'),
        configurationFiles: [
            path.join(__dirname, '../../testdata/json/config4.json')
        ],
        componentScan: false
    };
    const revane = new revane_1.default(options);
    return revane.initialize()
        .then(() => {
        t.pass();
        const app = new revaneExpress_1.default(revane, { port: -1 });
        return app.use('test12')
            .useControllers('test13')
            .listen()
            .catch((err) => {
            t.ok(err);
        });
    });
});
