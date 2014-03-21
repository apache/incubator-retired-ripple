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
describe("cordova vibrate bridge", function () {
    var vibration = ripple('platform/cordova/3.0.0/bridge/vibration'),
        goodVibrations = ripple('ui/plugins/goodVibrations');

    beforeEach(function () {
        spyOn(goodVibrations, "vibrateDevice");
    });

    it("can't be called with no args", function () {
        expect(vibration.vibrate).toThrow();
        expect(goodVibrations.vibrateDevice).not.toHaveBeenCalled();
    });

    it("can be called specifying milliseconds", function () {
        var vibelength = 789;
        vibration.vibrate(null, null, [vibelength]);
        expect(goodVibrations.vibrateDevice).toHaveBeenCalledWith(vibelength);
    });
});
