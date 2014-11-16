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
var ui = ripple('ui'),
    serviceUrl = "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|5&chl=";

function _processScanOk(success) {
    var scannedResult = {
        cancelled: false,
        text: $('#scannedText').val(),
        format: $('#formatDropDown option:selected').text()
    };
    success(scannedResult);
}

function _processScanCancel(success) {
    var scannedResult = {
        cancelled: true,
        text: "",
        format: ""
    };
    success(scannedResult);
}

module.exports = {
    scan: function(success, error, args) {
        try {
            // Showing the dialog
            $("#scanDialog").dialog({
                autoOpen: true,
                modal: true,
                title: "Barcode Scanner",
                heigh: 50,
                width: 510,
                position: 'center',
                resizable: false,
                buttons: [{
                    text: "OK",
                    click: function() {
                        $(this).dialog('close');
                        _processScanOk(success);
                    },
                    class: "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small-button",
                }, {
                    text: "Cancel",
                    click: function() {
                        $(this).dialog('close');
                        _processScanCancel(success);
                    },
                    class: "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only small-button",
                }]
            });
        } catch (err) {
            error("Fail to emulate BarcodeScanner.scan() method"); // Something went wrong
        }
    },

    // Uses google QR service - https://developers.google.com/chart/infographics/docs/qr_codes
    encode: function(success, error, args) {
        var data = args[0].data,
            url = serviceUrl + data;

        try {

            document.getElementById('barcodeClose').addEventListener("click", function() {
                ui.hideOverlay("barcodeBackground");
            });

            $('#barcodeImage').attr("src", url); // Adding encoded image  
            $('#barcodeData').html(data); // Adding data
            ui.showOverlay("barcodeBackground");
            success(); // ?! on Android VM success function is never called ?!
        } catch (err) {
            error("Fail to emulate BarcodeScanner.encode() method"); // Something went wrong
        }
    }
};
