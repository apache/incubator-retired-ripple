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
    _options = document.getElementById('browser-options');
    close = document.getElementById('browser-close'),
    _self = {
        initialize: function () {
            close.addEventListener('click', _self.hide);
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
        }
    };

module.exports = _self;
