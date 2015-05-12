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

var child_process = require('child_process'),
    fs = require('fs'),
    path = require('path'),
    shelljs = require('shelljs');

module.exports = function () {
    var ratName = 'apache-rat-0.10';
    var ratPath = path.join(process.cwd(), ratName, ratName + '.jar');

    if (!fs.existsSync(ratPath)) {
        console.log('Downloading Apache RAT...');
        var ratUrl = "https://dist.apache.org/repos/dist/release/creadur/apache-rat-0.10/apache-rat-0.10-bin.tar.gz";
        if (shelljs.which('curl')) {
            child_process.spawnSync('sh', ['-c', 'curl "' + ratUrl + '" | tar xz']);
        } else {
            child_process.spawnSync('sh', ['-c', 'wget -O - "' + ratUrl + '" | tar xz']);
        }
        if (!fs.existsSync(ratPath)) {
            throw new Error('Downloading RAT failed');
        }
    }

    // Generate RAT exclude flags from list of excluded file patterns
    var excludeFlags = [];
    [
        'node_modules',
        'theme.css',
        '.*',
        'bower.json',
        'apache-rat-0.10',
        '*.txt',
        'pkg',
        'manifest.json',
        'jquery.js',
        'jasmine',
        '3d.js',
        'Math.uuid.js',
        'draw.js',
        'jXHR.js',
        'jquery.js',
        'jquery.tooltip.js',
        'jquery.ui.js'
    ].forEach(function (excluded) {
        excludeFlags.push('-e', excluded);
    });

    console.log('Running Apache RAT...');
    var result = child_process.spawnSync('java', ['-jar', ratPath, '-d', '.'].concat(excludeFlags));
    if (result.status === 0) {
        process.stdout.write(result.stdout);
    } else {
        var err = 'Running RAT failed with exit code: ' + result.status;
        if (result.stderr) {
            err += '\n' + result.stderr;
        }
        require('colors');
        console.error(err.red);
    }
};
