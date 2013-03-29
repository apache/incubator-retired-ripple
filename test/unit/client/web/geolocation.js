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

describe("w3c_geolocation", function () {
    var w3c = "w3c/1.0/",
        web = "platform/web/default/",
        spec = ripple(web  + 'spec'),
        ui = ripple(web  + 'spec/ui');

    describe("spec", function () {
        it("includes require modules", function () {
            expect(spec.objects.Coordinates.path).toEqual(w3c + "Coordinates");
            expect(spec.objects.Position.path).toEqual(w3c + "Position");
            expect(spec.objects.PositionError.path).toEqual(w3c + "PositionError");
            expect(spec.objects.navigator.children.geolocation.path).toEqual(w3c + "geolocation");
        });

        describe("ui", function () {
            it("uses web/spec/ui module", function () {
                expect(spec.ui.plugins).toEqual(ui.plugins);
            });

            it("includes geoView plugin", function () {
                function includesGeoViewPlugin() {
                    return ui.plugins.some(function (plugin) {
                        return plugin === "geoView";
                    });
                }

                expect(includesGeoViewPlugin()).toBe(true);
            });
        });
    });
});
