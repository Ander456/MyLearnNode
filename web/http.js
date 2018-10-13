var http = require("http"),
    fs = require("fs"),
    url = require("url"),
    CACHE_TIME = 60 * 60 * 24 * 365;

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var realPath = __dirname + "/static" + pathname;
    if (pathname == "/favicon.ico") {
        return;
    }
    if (pathname == "/index" || pathname == "/") {
        goIndex(res);
    } else {
        dealWithStatic(pathname, realPath, res, req);
    }
}).listen(1337);

function goIndex(res, req) {
    var readPath = __dirname + "/" + url.parse("index.html").pathname;
    var indexPage = fs.readFileSync(readPath);
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(indexPage);
}

// function getUrlConf() {
//     var routerMsg = {};
//     try {
//         var str = fs.readFileSync(CONF + "mime_type.json", "utf8");
//         routerMsg = JSON.parse(str);
//     } catch (e) {
//         console.log("JSON parse failes");
//     }
//     return routerMsg;
// }

function dealWithStatic(pathname, realPath, res, req) {
    fs.exists(realPath, function (exists) {
        if (!exists) {
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.write("this request url" + pathname + "was not found on this server");
        } else {
            var pointPosition = pathname.lastIndexOf(".");
            mmieString = pathname.substring(pointPosition + 1);
            var mimeType = null;
            switch (mmieString) {
                case "css":
                    mimeType = "text/css";
                    break;
                case "png":
                    mimeType = "img/png";
                    break;
                default:
                    mimeType = "text/plain";
                    break;
            }
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    res.end();
                } else {
                    var fileInfo = fs.statSync(realPath);

                    var lastModified = fileInfo.mtime.toUTCString();

                    // 缓存
                    var expires = new Date();
                    expires.setTime(expires.getTime() + CACHE_TIME * 1000);
                    res.setHeader("Expires", expires.toUTCString());
                    res.setHeader("Cache-Control", "max-age=" + CACHE_TIME);


                    if (req.headers["if-modified-since"] && lastModified == req.headers["if=modified-since"]) {
                        res.writeHead(304, "Not Modified");
                        res.end();
                    } else {
                        res.setHeader("Last-Modified", lastModified);
                        res.writeHead(200, {
                            "Content-Type": mimeType
                        });
                        res.write(file, "binary");
                        res.end();
                    }
                }
            });
        }
    });
}

console.log("server running at http://localhost:1337/");