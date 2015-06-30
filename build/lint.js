/*
 *
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
 *
 */
/*global jake: false, fail: false, complete: false */
var _c = require('./conf'),
    fs = require('fs');

function _lintJSCommand(files) {
    files = files.length ? files : ".";
    return ["jshint"].concat(files).join(" ");
}

function _lintCSSCommand(files) {
    var cssDirs = ["assets/client/ripple.css", "lib/client", "assets/server", "test"],
        rules = JSON.parse(fs.readFileSync(_c.ROOT + ".csslintrc", "utf-8")),
        options = ["--errors=" + rules, "--format=compact", "--quiet"];

    files = files.length ? files : cssDirs;
    return ["csslint"].concat(options).concat(files).join(" ");
}

module.exports = function (files, done) {
    if (typeof files === "function") {
        done = files;
        files = [];
    }
    if (typeof done === "undefined") {
        // if we given no callback, use stub
        done = function () {};
    }
    var job,
        opts = {
            printStdout: true,
            printStderr: true,
            breakOnError: false
        },
        doneCount = 0,
        lintCode = 0,
        lintErrorMessage = "";

    function bindEvents(job, command) {
        job.addListener('error', function (msg, code) {
            lintCode++;
            lintErrorMessage += " " + command + " failed.";
        });
        job.addListener('end', function () {
            doneCount++;
            /* both jshint and csslint are completed */
            if (doneCount === 2) {
                done(lintCode);
                if (lintCode) {
                    fail(lintErrorMessage.substring(1), lintCode);
                } else {
                    complete();
                }
            }
        });
    }

    job = jake.exec(_lintJSCommand(files), opts);
    bindEvents(job, "jshint");
    job = jake.exec(_lintCSSCommand(files), opts);
    bindEvents(job, "csslint");
};
