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
var lint = require('./lint'),
    build = require('./build'),
    test = require('./test'),
    fs = require('fs'),
    _c = require('./conf'),
    fail = fs.readFileSync(_c.THIRDPARTY + "fail.txt", "utf-8");

function ok(code) {
    if (code || code === 1) {
        process.stdout.write(fail);
        process.exit(1);
    }
}

module.exports = function () {
    test(null, function (code) {
        ok(code, "red tests");
        lint(function (code) {
            ok(code);
            build(null, {compress: true});
        });
    });
};
