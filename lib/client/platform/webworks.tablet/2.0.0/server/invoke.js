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
    type = "normal",
    name = {
        "camera://": "Camera",
        "camera://video": "Video Camera",
        "map://": "Maps",
        "http://": "Browser",
        "music://": "Music",
        "photos://": "Photos",
        "videos://": "Videos",
        "appworld://": "App World",
        "update://": "Update"
    };

module.exports = {
    invoke: function (opts) {
        var app = name[opts.appType];
        if (app === undefined && opts.appType && opts.appType.match(/^http/i)) {
            app = "Browser";
        }

        notifications.openNotification(type,
           "Requested to launch: " + app + " application.");
        return {code: 1};
    }
};
