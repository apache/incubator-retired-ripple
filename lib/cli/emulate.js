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
var self,
    open = require('open'),
    emulate = require('./../server/emulate'),
    help = require('./help'),
    colors = require('colors');

colors.mode = "console";

self = {
    call: function (opts) {
        if (self.validateOptions(opts)) {
            self.start(opts);
        } else {
            console.error(('Options not understood: ' + process.argv.splice(2).join(' ')).red.bold);
            help.call('emulate');
        }
    },
    validateOptions: function (opts) {
        if (opts.path && opts.path.length !== 1) {
            return false;
        }
        if (opts.port && opts.port.length !== 1) {
            return false;
        }
        if (opts.remote && opts.remote.length !== 1) {
            return false;
        }
        if (opts.route && opts.route.length !== 1) {
            return false;
        }
        return true;
    },
    start: function (opts) {
        var app = emulate.start(opts);

        var uri = "http://localhost:" + app._port + "?enableripple=cordova-3.0.0";
        open(uri);
    }
};

module.exports = self;
