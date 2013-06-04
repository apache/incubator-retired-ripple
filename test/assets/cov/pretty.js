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

window.addEventListener('load', function () {
    var filedata = [];

    function asc(a, b) {
        return a.h1.innerHTML < b.h1.innerHTML ? -1 :
            (a.h1.innerHTML > b.h1.innerHTML ? 1 : 0);
    }

    Array.prototype.forEach
        .call(document.querySelectorAll('h1'), function (el) {
            filedata.push({
                h1: el,
                // This is pretty hacky.. might break at some point
                pre: el.nextSibling.nodeName === "#text" ?
                    el.nextSibling.nextSibling : el.nextSibling
            });
        });

    filedata = filedata.sort(asc);

    filedata.forEach(function (el) {
        var frag = document.createDocumentFragment();

        frag.appendChild(el.h1);
        frag.appendChild(el.pre);

        document.body.appendChild(frag);
    });

    setTimeout(function () {
        filedata.forEach(function (el) {
            el.h1.addEventListener('click', function () {
                var klass = el.pre.getAttribute('class') !== 'viewable' ? 'viewable' : '';
                el.pre.setAttribute('class', klass);
            });
        });

        document.body.setAttribute("style", "display: block;");
    }, 100);
});
