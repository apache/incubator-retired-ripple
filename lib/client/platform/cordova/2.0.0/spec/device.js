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
module.exports = {
    "NetworkStatus": {
        "connectionType": {
            "name": "Connection Type",
            "control": {
                "type": "select",
                "value": "ethernet"
            },
            "options": {
                "unknown": "UNKNOWN",
                "ethernet": "ETHERNET",
                "wifi": "WIFI",
                "2g": "CELL_2G",
                "3g": "CELL_3G",
                "4g": "CELL_4G",
                "none": "none"
            },
            "callback": function (setting) {
                var win = ripple('emulatorBridge').window(),
                    _console = ripple('console'),
                    connected = setting !== "none",
                    eventName = connected ? "online" : "offline";

                if (win && win.cordova) {
                    win.cordova.fireDocumentEvent(eventName);
                    _console.log("fired event ==> " + eventName);
                }

                ripple('bus').send("network", connected);
            }
        },
        "lag": {
            "name": "Lag the network",
            "control": {
                type: "checkbox",
                value: false
            },
            "callback": function (setting) {
                ripple('bus').send("lag", setting);
            }
        }
    },
    "globalization": {
        "locale": {
            "name": "locale name",
            "control": {
                "type": "select",
                "value": "en"
            },
            // Please do not confuse internationlization of Ripple itself
            // with internationalization of the program under test!
            //
            // The names below are shown in the Ripple UI.  They identify
            // the localesi that can be seen by the program under test.
            // The strings themselves should align with the locale for Ripple.
            // Since Ripple itself is not yet internationlized, these should
            // all be in English, not in the language of the selected locale.
            //
            // For example, to choose the en-US local, the user selects
            // "English (US)" and to choose the fr-FR locale, the user select
            // "French".  In a Ripple that was itself localized for the fr-FR
            // locale, the user would select "Anglaise (Etats Unis)" to select
            // en-US and "Francais" to select fr-FR.
            "options": {
                "en": "English (US)",
                "en-ca": "English (Canadian)",
                "fr": "French",
                "fr-ca": "French (Canadian)",
                "de": "German",
                "ru": "Russian"
            },
            // Earlier versions of the globalization plugin returned the above
            // strings as the result from getPreferredLanguage.  Modern versions
            // return the locale name instead, which is governed by ISO codes,
            // specifically ISO-639 (language codes) and ISO-3166 (country codes).
            //
            // Note also that the string used to specify a locale to the "moment"
            // package to not necessarily match the ISO standards.
            "localeName": {
                "en": 'en-US',
                "en-ca": 'en-CA',
                "fr": 'fr-FR',
                "fr-ca": 'fr-CA',
                "de": 'de-DE'
                "ru": 'ru-RU'
            },
            "callback": function (setting) {
                moment.lang(setting);
            }
        },
        "isDayLightSavingsTime": {
            "name": "Is daylight saving time",
            "control": {
                "type": "checkbox",
                value: false
            }
        },
        "firstDayOfWeek": {
            "name": "First Day of the week",
            "control": {
                "type": "select",
                "value": "1"
            },
            "options": {
                "1": "Sunday",
                "2": "Monday",
                "3": "Tuesday",
                "4": "Wednesday",
                "5": "Thursday",
                "6": "Friday",
                "7": "Saturday"
            },
        }
    }
};
