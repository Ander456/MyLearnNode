var http = require("http"),
    fs = require("fs"),
    url = require("url"),
    CACHE_TIME = 60 * 60 * 24 * 365,
    formidable = require("formidable"),
    jade = require("jade");

http.createServer(function (req, res) {
    res.render = function (template, options) {
        var str = fs.readFileSync(template, "utf8");
        var fn = jade.compile(str, {
            filename: template,
            pretty: true
        });
        var page = fn(options);
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(page);
    };

    var pathname = decodeURI(url.parse(req.url).pathname);
    var realPath = __dirname + pathname;
    switch (pathname) {
        case "/upload":
            upload(res, req);
            break;
        case "/image":
            showImage(res, req);
            break;
        case "/":
            defaultIndex(res);
            break;
        case "/index":
            defaultIndex(res);
            break;
        case "/show":
            show(res);
            break;
        default:
            dealWithStatic(pathname, realPath, res, req);
            break;
    }
}).listen(1337);

function upload(res, req) {
    var timestamp = Date.parse(new Date());
    var form = new formidable.IncomingForm();
    form.parse(req, function (error, fields, files) {
        var fileName = timestamp + "_" + files.image.name;
        fs.renameSync(files.image.path, __dirname + "/uploadFile/" + fileName);
        var realPath = __dirname + "/show_image.jade";
        res.render(realPath, {
            "imgUrl": "uploadFile/" + fileName
        });
    });
    // var realPath = __dirname + "/" + url.parse("show_image.html").pathname;
    // var indexPage = fs.readFileSync(realPath);
    // var form = new formidable.IncomingForm();
    // form.parse(req, function (error, fields, files) {
    //     if (!files.image) {
    //         return;
    //     }
    //     fs.renameSync(files.image.path, __dirname + "/uploadFile/test.png");
    //     res.writeHead(200, {
    //         "Content-Type": "text/html"
    //     });
    //     res.end(indexPage);
    // });
}

function show(res) {
    var readPath = __dirname + "/" + url.parse("show_image.html").pathname;
    var indexPage = fs.readFileSync(readPath);
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(indexPage);
}

function defaultIndex(res) {
    var realPath = __dirname + "/index.jade";
    res.render(realPath, {
        "user": "dahuang"
    });
    // var readPath = __dirname + "/" + url.parse("index.html").pathname;
    // var indexPage = fs.readFileSync(readPath);
    // res.writeHead(200, {
    //     "Content-Type": "text/html"
    // });
    // res.end(indexPage);
}

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