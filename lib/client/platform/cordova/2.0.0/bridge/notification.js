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
var notifications = ripple('notifications'),
    _console = ripple('console'),
    goodVibrations = ripple('ui/plugins/goodVibrations');

module.exports = {
    alert: function (success, error, args) {
        notifications.openNotification("normal", args[0]);
        return success && success();
    },

    confirm: function (resultCallback, someObject, confirmStrings) {
        // For some reason only 3 parameters are passed i
        //with all the options as the last parameter
        //this is a HACK to get it to work
        var options = confirmStrings;
        var message = options[0] || "";
        var title = options[1] || "";
        var buttonLabels = options[2];
        notifications.confirmNotification(message, resultCallback, title, buttonLabels);
    },

    activityStart: function () {
    },

    activityStop: function () {
    },

    progressStart: function () {
    },

    vibrate: function (success, error, args) {
        var ms = args[0] || 500;
        goodVibrations.vibrateDevice(ms);
    },

    beep: function (success, error, args) {
        for (var i = args[0]; i > 0; i--) {
            _console.log("beep!");
        }
        notifications.openNotification("normal", "BEEP x " + args[0]);
    }
};
