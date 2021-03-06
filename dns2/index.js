var http = require("http"),
    url = require("url"),
    router = require("./router");

http.createServer((req, res) => {
    var pathname = url.parse(req.url).pathname;
    req.setEncoding("utf8");
    res.writeHead(200, {
        'Content-Type': "text/html"
    });
    router.router(res, req, pathname);
}).listen(3000, "127.0.0.1");