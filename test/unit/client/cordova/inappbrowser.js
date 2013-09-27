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
describe("cordova inappbrowser bridge", function () {
    var iab = ripple('platform/cordova/3.0.0/bridge/inappbrowser'),
        event = ripple('event'),
        browser = ripple('ui/plugins/browser');

    describe("open", function () {
        var jwfMock;

        beforeEach(function () {
            jwfMock = {
                chill: jasmine.createSpy("chill"),
                andThen: jasmine.createSpy("andThen"),
                start: jasmine.createSpy("start")
            };

            jwfMock.chill.andReturn(jwfMock);
            jwfMock.andThen.andReturn(jwfMock);
            jwfMock.start.andReturn(jwfMock);

            spyOn(jWorkflow, "order").andReturn(jwfMock);
            spyOn(browser, "show");
            spyOn(event, "once");
        });

        it("shows the browser", function () {
            iab.open(null, null, ["a", "b", "c"]);
            expect(browser.show).toHaveBeenCalledWith("a", "b", "c");
        });

        it("creates a workflow for loading events", function () {
            iab.open(null, null, ["a", "b", "c"]);
            expect(jWorkflow.order).toHaveBeenCalled();
            expect(jwfMock.chill).toHaveBeenCalledWith(1);
            expect(jwfMock.chill).toHaveBeenCalledWith(10);
            expect(jwfMock.andThen).toHaveBeenCalledWith(jasmine.any(Function));
            expect(jwfMock.start).toHaveBeenCalled();
        });

        it("calls the win callback with loadstart from the workflow", function () {
            var win = jasmine.createSpy();
            iab.open(win, null, ["a", "b", "c"]);
            jwfMock.andThen.argsForCall[0][0]();
            expect(win).toHaveBeenCalledWith({type: "loadstart", url: "a"});
        });

        it("calls the win callback with loadstart from the workflow", function () {
            var win = jasmine.createSpy();
            iab.open(win, null, ["a", "b", "c"]);
            jwfMock.andThen.argsForCall[1][0]();
            expect(win).toHaveBeenCalledWith({type: "loadstop", url: "a"});
        });

        it("syncs once on the browser-close event", function () {
            iab.open(null, null, ["a", "b", "c"]);
            expect(event.once).toHaveBeenCalledWith("browser-close", jasmine.any(Function));
        });

        it("calls the win callback with exit on the browser-close event", function () {
            var win = jasmine.createSpy();
            iab.open(win, null, ["a", "b", "c"]);
            console.log(event.once.mostRecentCall);
            event.once.mostRecentCall.args[1]();
            expect(win).toHaveBeenCalledWith({type: "exit", url: "a"});
        });
    });

    describe("show", function () {
        var ui = ripple('ui');

        it("shows the inappbrowser overlay", function () {
            spyOn(ui, "showOverlay");
            iab.show();
            expect(ui.showOverlay).toHaveBeenCalledWith('inappbrowser');
        });
    });

    describe("close", function () {
        it("hides the browser", function () {
            spyOn(browser, "hide");
            iab.close();
            expect(browser.hide).toHaveBeenCalled();
        });
    });

    it("calls injectScript for injectScriptFile", function () {
        spyOn(browser, "injectScript");
        iab.injectScriptFile(null, null, ["bob"]);
        expect(browser.injectScript).toHaveBeenCalledWith("bob");
    });

    it("calls injectScript for injectScriptCode", function () {
        spyOn(browser, "injectScript");
        iab.injectScriptCode(null, null, ["bob"]);
        expect(browser.injectScript).toHaveBeenCalledWith("bob");
    });
});
