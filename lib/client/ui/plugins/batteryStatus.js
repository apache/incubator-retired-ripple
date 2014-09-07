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

var constants = ripple('constants'),
    db = ripple('db'),
    batteryLevel = document.getElementById(constants.BATTERY_STATUS.LEVEL_VALUE),
    batteryLevelLabel = document.getElementById(constants.BATTERY_STATUS.LEVEL_LABEL),
    isPlugged = document.getElementById(constants.BATTERY_STATUS.IS_PLUGGED_CHECKBOX);

function _getCurrentStatus() {
    var status = {
        level: batteryLevel.value,
        isPlugged: isPlugged.checked
    };
    return status;
}

function _saveStatus(status) {
    if (status) {
        db.save(constants.BATTERY_STATUS.BATTERY_STATUS_KEY, status.level);
        db.save(constants.BATTERY_STATUS.IS_PLUGGED_KEY, status.isPlugged);
    }
}

function _updateUI(status) {
    if (status) {
        batteryLevel.value = status.level;
        batteryLevelLabel.innerHTML = status.level + " %";
        isPlugged.checked = status.isPlugged;
    }
}

function _fireBatteryEvent(status) {
    var win = ripple('emulatorBridge').window();

    if (!win.cordova) {
        throw "You must have cordova.js included in your projects, to be able to trigger events";
    } else if (status) {
        win.cordova.fireWindowEvent("batterystatus", status);

        var level = parseInt(status.level);
        if (level === 20 || level === 5) {
            if (level === 20) {
                win.cordova.fireWindowEvent("batterylow", status);
            } else {
                win.cordova.fireWindowEvent("batterycritical", status);
            }
        }
    }
}

function _processStatusChanged() {
    var status = _getCurrentStatus();
    _saveStatus(status);
    _updateUI(status);
    _fireBatteryEvent(status);
}

module.exports = {
    panel: {
        domId: "battery-status-container",
        collapsed: true,
        pane: "left"
    },

    initialize: function() {
        jQuery("#" + constants.BATTERY_STATUS.LEVEL_VALUE).bind("mouseup", function() {
            _processStatusChanged();
        });

        jQuery("#" + constants.BATTERY_STATUS.IS_PLUGGED_CHECKBOX).bind("click", function() {
            _processStatusChanged();
        });

        var status = {
            level: db.retrieve(constants.BATTERY_STATUS.BATTERY_STATUS_KEY) || 100,
            isPlugged: db.retrieve(constants.BATTERY_STATUS.IS_PLUGGED_KEY) || false,
        };

        _updateUI(status);
    }
};
