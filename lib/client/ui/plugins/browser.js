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
    close = document.getElementById('close-browser');

module.exports = {
    initialize: function () {
        close.addEventListener('click', function () {
            ui.hideOverlay('inappbrowser');
        });
    },
    show: function (url, target, options) {

        var params = "url=" + url;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/ripple/browser");

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Content-length", params.length);
        xhr.setRequestHeader("Connection", "close");

        xhr.send(params, false);

        ui.showOverlay("inappbrowser", function (node) {
            var iframe = document.getElementById("browser");
            iframe.src = url;
        });
    },
    hide: function () {
        ui.hideOverlay("inappbrowser");
    }
};
