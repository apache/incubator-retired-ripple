/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var childProcess = require('child_process'),
    fs = require('fs'),
    path = require('path'),
    connect = require('connect'),
    test = require('./../test'),
    reporter = require('./cov/reporter'),
    coverjs = __dirname + "/../../node_modules/coverjs/bin/cover.js",
    _coveragePort = 7070,
    _coverageAssets = __dirname + '/../../test/assets/cov';

function instrument(callback) {
    var args = ["-r", "-o", "cov", "lib", "test", "-e", "test/assets/cov"],
        cmd = childProcess.spawn(coverjs, args);
    cmd.on("exit", callback);
}

function serveUpResults() {
    var indexHtml = fs.readFileSync(path.join(_coverageAssets, 'results.html'), "utf-8")
                          .replace(/<\/head>/i,
                                      '<link rel="stylesheet" href="style.css" />' +
                                      '<script src="pretty.js"></script>' +
                                   "</head>");

    connect
        .createServer()
        .use(connect.static(_coverageAssets))
        .use("/", function (req, res) { res.end(indexHtml); })
        .listen(_coveragePort, function () {
            console.log("  coverage results at");
            console.log("    http://127.0.0.1:" + _coveragePort);
            console.log();
        });
}

function cleanup(callback) {
    childProcess.exec('rm -rf cov/', callback);
}

module.exports = function (customPaths, done) {
    instrument(function () {
        global.__$coverObject = {};

        test(customPaths || ["cov/test"], function () {
            console.log("Generating coverage report...");
            console.log();

            cleanup(function () {
                reporter.report(serveUpResults, done);
            });
        }, {withCoverage: true});
    });
};
