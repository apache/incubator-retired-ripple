var express = require('express');

module.exports = {
    inject: function () {
        return function (req, res, next) {
            express.static(req.staticSource)(req, res, next);
        };
    }
};
