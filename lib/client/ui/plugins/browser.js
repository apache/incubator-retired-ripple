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

var ui = ripple('ui'),
    event = ripple('event'),
    _url = document.getElementById('browser-url'),
    _target = document.getElementById('browser-target'),
    _options = document.getElementById('browser-options'),
    _injectJS = document.getElementById('browser-inject-js'),
    _injectJSHeader = document.getElementById('browser-inject-js-header'),
    _injectCSS = document.getElementById('browser-inject-css'),
    _injectCSSHeader = document.getElementById('browser-inject-css-header'),
    _close = document.getElementById('browser-close'),
    _self = {
        initialize: function () {
            _close.addEventListener('click', _self.hide);
            _injectJSHeader.style.display = "none";
            _injectCSSHeader.style.display = "none";
        },
        show: function (url, target, options) {
            _url.innerHTML = url;
            _target.innerHTML = target;
            _options.innerHTML = JSON.stringify(options);
            ui.showOverlay("inappbrowser");
        },
        hide: function () {
            ui.hideOverlay("inappbrowser");
            event.trigger("browser-close");
        },

        injectScript: function (script) {
            _injectJSHeader.style.display = "block";
            _injectJS.innerHTML = script;
        },

        injectCSS: function (css) {
            _injectCSSHeader.style.display = "block";
            _injectCSS.innerHTML = css;
        }
    };

module.exports = _self;
