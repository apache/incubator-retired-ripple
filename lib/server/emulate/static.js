var express = require('express');

module.exports = {
    inject: function (opts) {
        return function (req, res, next) {
            express.static(req.staticSource)(req, res, next);
        };
    }
};
