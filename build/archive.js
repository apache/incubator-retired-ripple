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
    jWorkflow = require('jWorkflow'),
    semver = require('semver'),
    path = require('path'),
    _c = require('./conf');

module.exports = function (options) {
    if (options.length === 1 && options[0].toLowerCase() === "help") {
        usage(true);
        return;
    }

    var config = processOptions(options);

    var order = jWorkflow.order(verifyBuiltFiles)
        .andThen(verifyTagName)
        .andThen(checkoutTag);

    if (!config.allowPending) {
        order.andThen(checkPendingChanges);
    }

    order.andThen(buildPackage);

    if (config.sign) {
        order.andThen(signArchive)
            .andThen(computeMd5Hash)
            .andThen(computeShaHash);
    }

    order.start({initialValue: config, callback: done});
};

function done(result) {
    if (!result || !result.failed) {
        console.log('\nArchive created.');
    }
}

function processOptions(options, baton) {
    var packageType,
        allowPending = false,
        tagName = null;

    options.forEach(function (option) {
        var lowerCaseOption = option.toLowerCase();
        switch (lowerCaseOption) {
            case 'apache':
            case 'npm':
                if (packageType) {
                    error("Can't set package type to '" + option + "' when it is already set to '" + packageType + "'.", baton);
                }
                packageType = lowerCaseOption;
                break;

            case 'allow-pending':
                allowPending = true;
                break;

            default:
                if (tagName) {
                    error("Can't set tag name to '" + option + "' when it is already set to '" + tagName + "'.", baton);
                }
                tagName = option;
        }
    });

    var isNpm = packageType === 'npm';
    return {
        tagName: tagName,
        allowPending: !isNpm || allowPending, // Pending files irrelevant when package from git
        sign: !isNpm,
        packageType: isNpm ? 'npm' : 'git',
        includeBuilt: isNpm
    };
}

function verifyBuiltFiles(config, baton) {
    // Require or remove built files
    if (config.includeBuilt) {
        // Verify pkg folder exists and contains files
        if (!fs.existsSync(_c.DEPLOY) || fs.readdirSync(_c.DEPLOY).length === 0) {
            error('You must build Ripple before creating npm package.', baton);
        }
    }
    return config;
}

function verifyTagName(config, baton) {
    baton.take();

    if (config.tagName) {
        baton.pass(config);
        return;
    }

    // Determine the most recent tag in the repository
    exec('git tag --list', baton, function (allTags) {
        config.tagName = allTags.split(/\s+/).reduce(function (currentBest, value) {
            var modifiedValue = value.replace(/^v/, '');
            if (semver.valid(modifiedValue)) {
                return !currentBest ? value : semver.gt(currentBest.replace(/^v/, ''), modifiedValue) ? currentBest : value;
            }
            if (currentBest) {
                return currentBest;
            }
            return null;
        });

        baton.pass(config);
    });
}

function checkoutTag(config, baton) {
    baton.take();

    if (!config.tagName) {
        error("Couldn't find the most recent tag name - please specify a tag or branch explicitly.", baton);
    }

    // Don't checkout the tag if its already checked out
    exec('git symbolic-ref -q --short HEAD || git describe --tags --exact-match', baton, function (currentBranch) {
        if (currentBranch === config.tagName) {
            baton.pass(config);
            return;
        }

        exec('git checkout -q ' + config.tagName, baton, function (result) {
            baton.pass(config);
        });
    });
}

function checkPendingChanges(config, baton) {
    baton.take();

    if (config.allowPending) {
        baton.pass(config);
    }

    exec('git status --porcelain', baton, function (result) {
        if (result) {
            error('Aborting because there are pending changes.', baton);
        } else {
            baton.pass(config);
        }
    });
}

function buildPackage(config, baton) {
    baton.take();

    console.log('Creating archive for tag: ' + config.tagName + '...');

    if (config.packageType === 'npm') {
        exec('npm pack', baton, function (filename, err) {
            baton.pass(filename);
        });
    } else {
        var filenameRoot = 'ripple-emulator' + '-' + config.tagName + '-incubating';
        var filename = path.resolve(filenameRoot + '.tgz');
        exec('git archive --prefix ' + filenameRoot + '/ -o ' + filename + ' ' + config.tagName, baton, function (result) {
            baton.pass(filename);
        });
    }
}

function signArchive(filename, baton) {
    baton.take();

    console.log('Signing archive...');
    exec('gpg --armor --detach-sig --output ' + filename + '.asc ' + filename, baton, function (result) {
        baton.pass(filename);
    });
}

function computeMd5Hash(filename, baton) {
    computeHash(filename, 'md5', 'MD5', baton);
}

function computeShaHash(filename, baton) {
    computeHash(filename, 'sha1', 'SHA1', baton);
}

function computeHash(filename, ext, algo, baton) {
    baton.take();

    console.log('Computing ' + algo + ' for: ' + filename);
    exec('gpg --print-md ' + algo + ' ' + filename, baton, function (result) {
        fs.writeFileSync(filename + '.' + ext, extractHashFromOutput(result) + '\n');
        baton.pass(filename);
    });

}

function extractHashFromOutput(output) {
    var pos = output.lastIndexOf(':');
    return output.slice(pos + 1).replace(/\s*/g, '').toLowerCase() + ' *' + path.basename(output.slice(0, pos));
}

function exec(cmdLine, baton, callback) {
    // If we're provided with a jWorkflow baton, then on error we'll use the baton to deal with it and not call callback().
    // Otherwise we pass errors to callback().

    if (!callback && typeof baton === 'function') {
        callback = baton;
        baton = null;
    }

    child_process.exec(cmdLine, function (err, stdout, stderr) {
        err = err || stderr;

        if (err && baton) {
            error(err, baton);
        } else {
            callback((stdout || '').trim(), err);
        }
    });
}

function error(msg, baton) {
    console.log();

    if (typeof msg === 'object') {
        // Error came from console or somewhere. Just display it.
        console.log('' + msg);
    } else {
        // Error likely came from us - display it and also usage.
        console.log('Error: ' + msg);
        usage();
    }

    if (baton) { baton.drop({failed: true}); }
}

function usage(includeIntro) {
    if (includeIntro) {
        console.log('');
        console.log('Creates a tgz file for a tag or branch, either for the Apache archives or npm.');
    }

    console.log('');
    console.log('Usage:');
    console.log('');
    console.log('jake archive[apache|npm,allow-pending,<tagname>]');
    console.log('');
    console.log('  apache:        (default) Create an Apache archive (creates a git archive,\n' +
                '                 signs it, and creates .md5 and .sha hashes).');
    console.log('  npm:           Create an npm package (requires built files to be present,\n' +
                '                 and does not sign).');
    console.log('  allow-pending: If specified, allow uncommitted changes to exist when\n' +
                '                 packaging (only use this for testing). This option is\n' +
                '                 ignored when creating an Apache archive, since that is created\n' +
                '                 directly from git.');
    console.log('  <tagname>:     If specified, an existing tag or branch to archive. Otherwise\n' +
                '                 defaults to the most recent tag.');
}

