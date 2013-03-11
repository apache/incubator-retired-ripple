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
var db = ripple('db'),
    _KEY = "blackberry-pim-category",
    _self;

function _get() {
    return db.retrieveObject(_KEY) || [];
}

function _save(category) {
    var categories = _get();
    if (!categories.some(function (item) {
        return item === category;
    })) {
        categories.push(category);
        db.saveObject(_KEY, categories);
    }
}

function _remove(category) {
    var categories = _get(),
        index = categories.indexOf(category);

    if (index >= 0) {
        categories.splice(index, 1);
        db.saveObject(_KEY, categories);
    }
}

_self = {
    addCategory: function (args) {
        _save(args.categoryName);
        return {code: 1};
    },
    deleteCategory: function (args) {
        _remove(args.categoryName);
        return {code: 1};
    },
    getCategories: function () {
        return {code: 1, data: _get()};
    }
};

module.exports = _self;
