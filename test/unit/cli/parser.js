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

describe("cli", function () {
    var parser = require('./../../../lib/cli/parser'),
        basicArgs = ["node", "ripple"],
        parsed;

    it("can properly parse an argumentless flag as a truthy (boolean)", function () {
        var args = ["--foo"];

        parsed = parser.parse(basicArgs.concat(args));

        expect(parsed).toEqual({
            commands: [],
            options: {"foo": true}
        });
    });

    it("can parse sub commands", function () {
        var subcommands = ["cmd", "subcmd", "subcmd2"];

        parsed = parser.parse(basicArgs.concat(subcommands));

        expect(parsed).toEqual({
            commands: subcommands,
            options: {}
        });
    });

    it("can parse multiple flags with multiple values", function () {
        var multipleFlagsWithMultipleArgs = [
            "cmd", "subcmd", "--a", "b", "c", "--d", "e", "f", "--g", "h"
        ];

        parsed = parser.parse(basicArgs.concat(multipleFlagsWithMultipleArgs));

        expect(parsed).toEqual({
            commands: ["cmd", "subcmd"],
            options: {
                "a": ["b", "c"],
                "d": ["e", "f"],
                "g": "h"
            }
        });
    });

    it("can use map to change the value of the option", function () {
        var multipleFlagsWithMultipleArgs = [
            "cmd", "--a", "b", "c"
        ];

        parser.map("a", function () { return 12; });
        parsed = parser.parse(basicArgs.concat(multipleFlagsWithMultipleArgs));

        expect(parsed).toEqual({
            commands: ["cmd"],
            options: {
                "a": 12
            }
        });
        parser.map("a", null);
    });
});
