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
var fs = require('fs'),
    HTMLReporter = require('./../../../node_modules/coverjs/lib/reporters/HTMLReporter'),
    resultsFile = __dirname + '/../../../test/assets/cov/results.html';

function report(done) {
    var html = new HTMLReporter(global.__$coverObject),
        reportHTML = html.report(),
        coveragePercent = Math.round((html.pass / html.total) * 100);

    reportHTML = reportHTML.replace(/<body>/g,
                            '<body style="display: none;">' +
                               '<div class="totals">' +
                                 '<div class="total-coverage">' + coveragePercent + "% coverage</div>" +
                                 '<div class="total-statements">' + html.total + " statements</div>" +
                                 '<div class="total-covered">' + html.pass + " covered</div>" +
                                 '<div class="total-skipped">' + html.error + " skipped</div>" +
                               '</div>');

    fs.writeFileSync(resultsFile, reportHTML, 'utf-8');

    console.log('  Total Coverage      ' + coveragePercent + '%');
    console.log();
    console.log('  Statements          ' + html.total);
    console.log('    Covered           ' + html.pass);
    console.log('    Skipped           ' + html.error);
    console.log();

    done();
}

module.exports = {
    report: report
};
