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
"use strict";

var exec = require('child_process').exec;

module.exports = {
    refresh: function () {
        var cordovaPrepare;

        try {
            cordovaPrepare = require.resolve('cordova') ? require('cordova/src/prepare') : null;
        } catch (e) {
            console.log('INFO: '.green +
                        'Could not find cordova as a local module. Expecting to find it installed globally.');
        }

        return function (req, res /*, next */) {

            var callback = function (err) {
                if (err) {
                    console.error('Failed to execute command: cordova prepare. '.red +
                                  'Make sure you\'ve installed cordova.'.red);
                    res.status(500).send('Cannot prepare sources for the platform: ' + err);
                } else {
                    res.status(200).send('OK');
                    console.log('... done.');
                }
            };

            if (req.staticPlatform) {
                console.log('refreshing project (platform: ' + req.staticPlatform + ') ...');
                if (!!cordovaPrepare) {
                    cordovaPrepare({ platforms: [ req.staticPlatform ] }).then(callback).done();
                } else {
                    exec('cordova prepare ' + req.staticPlatform, callback);
                }
            } else {
                res.status(500).send('Cannot prepare: no platform is detected');
            }

        };
    }
};
