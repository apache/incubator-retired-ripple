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

var db              = ripple('db'),
    dialogTmpl      = '<div><input type="text" class="ui-state-default ui-corner-all" placeholder="Barcode or blank for error call"/></div>';

module.exports = {

    scan: function (win, fail, args) {

        if( !$.isArray(args) ) throw new Error('Arguments must be an array');

        if( !args.length || typeof args[0] != "string" ) throw new Error('Application key is required');

        var barcode         = db.retrieve('lastBarcode', 'scanditsdk'),
            barcodeType,
            dialogContainer = $( dialogTmpl ).attr({
                id      : 'dialog-requestbarcode',
                title   : 'Enter barcode data'
            });

        if( barcode ){
            dialogContainer.find('input').val( barcode );
        }

        //request user an barcode data
        dialogContainer.dialog({
            appendTo    : 'body',
            modal       : true,
            resizable   : false,
            autoOpen    : true,
            position    : 'center',
            minWidth    : '400',
            buttons     : [
                {
                    text    : 'Cancel',
                    click   : function(){
                        dialogContainer.dialog('close');
                        dialogContainer.remove();

                        fail();
                    }
                },
                {
                    text    : 'Ok',
                    click   : function(){

                        barcode = $.trim( dialogContainer.find('input').val() );

                        dialogContainer.dialog('close');
                        dialogContainer.remove();

                        //return barcode data to application
                        if( barcode ){
                            db.save('lastBarcode', barcode, 'scanditsdk');

                            win([ barcode, barcodeType ]);
                        }
                        else {
                            fail();
                        }
                    }
                }
            ]
        });

    }
};
