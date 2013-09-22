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
var url = require('url'),
    request = require('request'),
    _url = "http://slashdot.org";

// TODO: Put this and xhr_proxy into common file (epic DRY..)?
function proxyRemote(opts, req, res) {
    var proxyReqData,
        proxyReqHeaders,
        proxyReq,
        parsedURL = url.parse(opts.url),

        // TODO: There should be a better way to inject on files...
        shouldInjectInto = req.path.match(/^\/$/) || req.path.match(/\.html/);

    console.log("INFO:".green + " Remote proxy: Retrieve -> " + opts.url);

    proxyReqHeaders = Object.keys(req.headers).reduce(function (headers, key) {
        if (key !== "origin") {
            headers[key] = req.headers[key];
        }
        return headers;
    }, {});

    proxyReqHeaders["host"] = parsedURL.host;

    if (opts.userAgent) {
        proxyReqHeaders["user-agent"] = opts.userAgent;
    }

    // HACK: Makes https://google.com crash (issue with node? request? us?)
    delete proxyReqHeaders["accept-encoding"];

    proxyReqData = {
        url: parsedURL,
        method: req.method,
        headers: proxyReqHeaders
    };

    if (Object.keys(req.body).length > 0) {
        if (req.get("content-type") === "application/json") {
            proxyReqData.body = JSON.stringify(req.body);
        } else {
            proxyReqData.form = req.body;
        }
    }

    // Attempt to catch any synchronously thrown exceptions
    try {
        proxyReq = request(proxyReqData, function (error, response, body) {
            if (error) {
                console.log("ERROR:".red + " Remote proxying failed with:", error);
                res.send(500, error);
            } else if (shouldInjectInto) {
                if (body) {
                    // pretty sure this callback can be called multiple times (not just when complete)
                    body = body.replace(HEAD_TAG,
                              '<head>' +
                                '<script>' +
                                    BOOTSTRAP_FROM_IFRAME +
                                '</script>');

                    // TODO: Why only need to set new content-length here (and not for localInjection)?
                    response.headers['content-length'] = body.length;

                    res.status(response.statusCode);
                    res.set(response.headers);
                    res.send(body);
                }
            }
        });

        // TODO: Pipe is awesome, but can't modify body (?)
        if (!shouldInjectInto) {
            proxyReq.pipe(res);
        }
    } catch (e) {
        res.send(500, e.toString());
    }
}

module.exports = {
    inject: function (opts) {
        return function (req, res, next) {
            if (req.originalUrl.match(/\/ripple\/browser\/*/)) {
                console.log(req.method);
                if (req.method === "POST") {
                    console.log(req.body.url);
                    _url = req.body.url;
                    res.send(200);
                } else {
                    proxyRemote({
                        url: _url + req.url.replace("/ripple/browser", ""),
                        userAgent: opts.userAgent
                    }, req, res);
                }
            }
            else {
                next();
            }
        };
    }
};
