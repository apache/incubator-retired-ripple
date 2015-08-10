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
var goodVibrations = ripple('ui/plugins/goodVibrations');
var event = ripple('event');
var timerId = null;
var pattern = [];
var repeat = -1;

function cancelVibrationPattern() {
    // Abort the present animation, if any is active
    goodVibrations.stop();
    // Clear any pending timers
    if (timerId) clearTimeout(timerId);
    // reinitialize the data structures;
    timerId = null;
    pattern = [];
    repeat = -1;
}

function patternIsFinished(i) {
    if (i >= pattern.length) { // no more steps left in this pattern
        if (repeat > 0) {
            repeat = repeat - 1; // go on to next iteration of this pattern
            runNextPatternStep(0);
        }
        return true;
    }
    return false;
}

function runNextPatternStep(i) {
    var ms;
    if (patternIsFinished(i)) { // bail out if more steps left in this pattern
        return;
    }
    ms = pattern[i];
    if (ms > 0) goodVibrations.vibrateDevice(ms);
    // Pattern needs at least two more entries to keep going
    // (the next entry is just a delay time).
    i = i + 2;
    if (patternIsFinished(i)) { // bail out if more steps left in this pattern
        return;
    }
    // Wait for the shaking interval to elapse and the time between
    // shaking intervals to elapse before running the next pattern step
    timerId = setTimeout(
        function() {
            runNextPatternStep(i);
        }, pattern[i - 1] + pattern[i - 2]);
}

module.exports = {
    // A vibration pattern is an array of microsecond values.
    // You turn on for array[0] ms, then off for array[1] ms,
    // then on for array[2] ms and so on.
    vibrateWithPattern: function (win, fail, args) {
        if (pattern.length > 0) {
            cancelVibrationPattern(); // Stop current pattern before starting a new one
        }
        pattern = args[0];
        repeat  = args[1];
        runNextPatternStep(0);
    },
    // Cancel the current pattern (if any)
    cancelVibration: function (win, fail, args) {
        cancelVibrationPattern();
    },
    vibrate: function (win, fail, args) {
        var ms = args[0] || 500;
        goodVibrations.vibrateDevice(ms);
    }
};

event.on("EmulatorUnload", cancelVibrationPattern);
