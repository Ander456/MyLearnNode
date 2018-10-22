var fs = require("fs"),
    sys = require("util");

exports.get = function (fileName, key) {
    var configJson = {};
    try {
        var realPath = __dirname + "/" + fileName;
        var str = fs.readFileSync(realPath, "utf8");
        configJson = JSON.parse(str);
    } catch (err) {
        sys.debug("JSON parse failes");
    }
    return configJson[key];
};