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

var _send = document.getElementById("bus-send"),
    _receive = document.getElementById("bus-receive"),
    _evt = document.createEvent("Events");

_evt.initEvent('bus-init', true, true);
document.dispatchEvent(_evt);

module.exports = {
    send: function (msg, data, callback) {
        var m = document.createElement("span");
        m.dataset.msg = msg;
        m.innerHTML = JSON.stringify(data);

        if (callback) {
            m.dataset.callback = Math.uuid();
            this.receive(m.dataset.callback, callback);
        }

        _send.appendChild(m);
    },

    receive: function (msg, handler) {
        if (!handler) {
            return;
        }

        _receive.addEventListener("DOMNodeInserted", function (evt) {
            if (evt.target.dataset.msg === msg) {
                handler(JSON.parse(evt.target.innerHTML));
            }
        });
    },

    ajax: function (method, url, data, success, fail) {
        this.send("xhr", {
            method: method,
            url: url,
            data: data
        }, function (result) {
            if (result.code === 200) {
                success(result.data);
            }
            else {
                fail(result);
            }
        });
    }
};
