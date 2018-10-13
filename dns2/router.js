var ParseDns = require("./parse_dns"),
    MainIndex = require("./main_index");

exports.router = function (res, req, pathname) {
    switch (pathname) {
        case "/parse":
            ParseDns.parseDns(res, req);
            break;
        default:
            MainIndex.goIndex(res, req);
    }
}