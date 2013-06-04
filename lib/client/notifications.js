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
    exception = ripple('exception');

function _validateAndInitNType(nType) {
    nType = nType || "normal";

    if (nType !== "normal" && nType !== "error") {
        exception.raise(exception.types.NotificationType, "Unknown Notification Type == " + nType + ",when dealing with Console notification.");
    }

    return nType;
}

function _processNotification(nType, stateType, message) {
    nType = _validateAndInitNType(nType);
    message = message || "";

    var display,
        displayText,
        className,
        notificationIcon,
        box = document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS),
        msgBox = document.getElementById(constants.NOTIFICATIONS.MESSAGE_TEXT_CONTAINER_CLASS);

    className = "ui-widget";

    switch (stateType) {

    case constants.NOTIFICATIONS.STATE_TYPES.CLOSE:
        display = "display: none;"; //need to do this better.
        displayText = "";
        break;

    case constants.NOTIFICATIONS.STATE_TYPES.OPEN:
        display = "display: block;"; //need to do this better.
        displayText = message;
        if (nType === "error") {
            displayText = "Oh Snap!\n\n" + displayText;
            className += " ui-state-error ui-corner-all";
            notificationIcon = '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>';
        }
        else {
            className += " ui-state-highlight ui-corner-all";
            notificationIcon = '<span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>';
        }
        break;

    default:
        exception.raise(exception.types.NotificationStateType, "Unknown StateType == " + stateType.toString());
    }

    msgBox.innerHTML = notificationIcon + displayText;
    box.setAttribute("class", className);
    box.setAttribute("style", display);

}

function _processConfirm (message,resultCallback,title,buttonLabels) {
    buttonLabels = buttonLabels || "";
    message = message || "";
    title = title || "Confirm";
    var btnArray = (!buttonLabels || 0 === buttonLabels.length) ? [] : buttonLabels.split(',');
    var buttons = [];

    btnArray.forEach(function(btnLabel,index) {
        var button = {};
        button["text"] = btnLabel;
        button["click"] = function () {
            if(resultCallback !== typeof "undefined")
                resultCallback(index);
            jQuery( this ).dialog( "close" );
        };
        buttons.push(button);
    });
    var dialogBox = jQuery("#confirm-dialog");
    dialogBox.dialog("option","title", title);
    jQuery("#confirm-message").text(message);
    dialogBox.dialog("open");
    if(btnArray.length > 0){
        dialogBox.dialog( "option", "buttons", buttons);
        return;
    }
    var closeBox = function() {
        dialogBox.dialog("close");
    };
    jQuery("#confirm-cancel").button().unbind().bind('click', closeBox).show();
    jQuery("#confirm-ok").button().unbind().bind('click', closeBox).show();
}

module.exports = {
    openNotification: function (nType, msg) {
        _processNotification(nType, constants.NOTIFICATIONS.STATE_TYPES.OPEN, msg);
    },

    closeNotification: function (nType) {
        _processNotification(nType, constants.NOTIFICATIONS.STATE_TYPES.CLOSE);
    },

    confirmNotification: function (message, resultCallback, title, buttonLabels) {
        _processConfirm(message,resultCallback,title,buttonLabels);
    }
};
