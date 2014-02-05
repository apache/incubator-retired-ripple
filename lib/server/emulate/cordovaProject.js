var path = require('path'),
    fs = require('fs');

function buildPaths(opts) {
    var paths = {
        orig: opts.path[0]
    };

    if(fs.existsSync(path.join(paths.orig, ".cordova")) || fs.existsSync(path.join(paths.orig, "config.xml"))) {
        console.log("Cordova 3.0 Project detected...");
        var platforms = fs.readdirSync(path.join(paths.orig, "platforms"));
        if (platforms.indexOf('android') >= 0) {
            opts.cordova = 'android';
            paths.android = path.join(paths.orig, "platforms", "android", "assets", "www");
        }

        if (platforms.indexOf('ios') >= 0) {
            opts.cordova = 'ios';
            paths.ios = path.join(paths.orig, "platforms", "ios", "www");
        }

        if (platforms.indexOf('firefoxos') >= 0) {
            opts.cordova = 'firefoxos';
            paths.firefox = path.join(paths.orig, "platforms", "firefoxos", "www");
        }

        if (platforms.indexOf('blackberry10') >= 0) {
            opts.cordova = 'blackberry10';
            paths.blackberry = path.join(paths.orig, "platforms", "blackberry10", "www");
        }
    }

    return paths;
}

module.exports = {
    inject: function (opts) {
        var paths = buildPaths(opts);
        return function (req, res, next) {
            var pth = paths.orig,
                userAgent = opts.userAgent || "";

            if (opts.cordova) {
                if (userAgent.match(/Android/)) { pth = paths.android; req.staticPlatform = "android"; }
                else if (userAgent.match(/iPhone/)) { pth = paths.ios; req.staticPlatform = "ios"; }
                else if (userAgent.match(/iPad/)) { pth = paths.ios; req.staticPlatform = "ios"; }
                else if (userAgent.match(/BB10/)) { pth = paths.blackberry; req.staticPlatform = "blackberry"; }
                else if (userAgent.match(/PlayBook/)) { pth = paths.blackberry; req.staticPlatform = "blackberry"; }
                else if (userAgent.match(/BlackBerry/)) { pth = paths.blackberry; req.staticPlatform = "blackberry"; }
                else { pth = paths.android; req.staticPlatform = "android"; }
            }

            req.staticSource = pth;
            next();
        };
    }
};
