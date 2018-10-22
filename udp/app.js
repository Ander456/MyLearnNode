/**
 * 文件路径需要在入口文件统一管理
 * 文件路径名最好全大写字母进行变量区分
 * 所有应用到的模块需要添加命名空间统一管理
 * 响应类方法或者数据 统一添加到响应对象res中进行管理
 */

global.BASE_DIR = __dirname;
global.LIB = BASE_DIR + "/node_modules/";
global.STATIC = BASE_DIR + "/static";
global.VIEW = BASE_DIR + "/view";

global.lib = {
    http: require("http"),
    fs: require("fs"),
    url: require("url"),
    querystring: require("querystring"),
    jade: require("jade"),
    path: require("path"),
    util: require("util"),
    formidable: require("formidable"),
    webserver: require("./web_server"),
    dgram: require("dgram")
};

global.app = lib.http.createServer(function (req, res) {
    res.render = function () {
        var template = arguments[0];
        var options = arguments[1];
        var str = lib.fs.readFileSync(template, "utf8");
        var fn = lib.jade.compile(str, {
            filename: template,
            pretty: true
        });
        var page = fn(options);
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(page);
    };
    var server = new lib.webserver(res, req);
    var pathname = decodeURI(lib.url.parse(req.url).pathname);
    var realPath = __dirname + pathname;

    switch (pathname) {
        case "/upload":
            server.uploadAction();
            break;
        case "/":
            server.uploadPage();
            break;
        default:
            dealWithStatic(pathname, realPath, res, req);
            break;
    }

}).listen(8000);

function dealWithStatic(pathname, realPath, res, req) {
    lib.fs.exists(realPath, function (exists) {
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
            lib.fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    res.end();
                } else {
                    var fileInfo = lib.fs.statSync(realPath);

                    var lastModified = fileInfo.mtime.toUTCString();

                    // 缓存
                    var expires = new Date();
                    expires.setTime(expires.getTime() + 1000 * 1000);
                    res.setHeader("Expires", expires.toUTCString());
                    res.setHeader("Cache-Control", "max-age=" + 1000);


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