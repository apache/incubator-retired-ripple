/*
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
 */

describe("phonegap events", function () {
    var spec = ripple('platform/cordova/1.0.0/spec'),
        emulatorBridge = ripple('emulatorBridge'),
        events = spec.events;

    function _expectsEventToFire(name) {
        var evt = {initEvent: jasmine.createSpy()};

        spyOn(emulatorBridge, "document").andReturn(document);
        spyOn(document, "createEvent").andReturn(evt);
        spyOn(document, "dispatchEvent");

        events[name].callback();

        expect(document.createEvent).toHaveBeenCalledWith("Events");
        expect(evt.initEvent).toHaveBeenCalledWith(name, true, false);
        expect(document.dispatchEvent).toHaveBeenCalledWith(evt);
    }

    describe("spec/ui", function () {
        it("includes the platformEvents ui plugin", function () {
            expect(spec.ui.plugins.some(function (plugin) {
                return plugin === "platformEvents";
            })).toBe(true);
        });
    });

    describe("deviceready", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("deviceready");
        });
    });

    describe("backbutton", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("backbutton");
        });
    });

    describe("menubutton", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("menubutton");
        });
    });

    describe("pause", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("pause");
        });
    });

    describe("resume", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("resume");
        });
    });

    describe("searchbutton", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("searchbutton");
        });
    });

    describe("online", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("online");
        });
    });

    describe("offline", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("offline");
        });
    });
});
