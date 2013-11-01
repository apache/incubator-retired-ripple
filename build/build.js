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
var fs = require('fs'),
    jWorkflow = require('jWorkflow'),
    quotes = require('./quotes'),
    pack = require('./pack'),
    clean = require('./clean'),
    _c = require('./conf'),
    compress = require('./compress'),
    hosted = require('./targets/hosted');

function _done(error) {
    if (error) {
        process.stdout.write(fs.readFileSync(_c.THIRDPARTY + "fail.txt", "utf-8"));
        process.stdout.write(error);
        process.exit(1);
    } else {
        process.stdout.write(fs.readFileSync(_c.THIRDPARTY + "dredd.txt", "utf-8"));
        quotes.random();
        process.exit();
    }
}

function _handle(func) {
    return function () {
        try {
            func.apply(func, Array.prototype.slice.call(arguments));
        } catch (e) {
            _done(e.message + "\n" + e.stack);
        }
    };
}

module.exports = _handle(function (ext, opts) {
    opts = opts || {};

    var build = jWorkflow.order(clean)
                         .andThen(pack)
                         .andThen(hosted);

    if (opts.compress) {
        build.andThen(compress);
    }

    build.start(function () {
        _done();
    });
});
