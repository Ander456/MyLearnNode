var http = require("http"),
    dns = require("dns"),
    fs = require("fs"),
    url = require("url"),
    querystring = require("querystring")

http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    var pathname = url.parse(req.url).pathname;
    router(res, req, pathname);
}).listen(3000, "127.0.0.1");

function router(res, req, pathname) {
    switch (pathname) {
        case "/parse":
            parseDns(res, req);
            break;
        default:
            goIndex(res, req);
    }
}

function goIndex(res, req) {
    var readPath = __dirname + "/" + url.parse("index.html").pathname;
    var indexPage = fs.readFileSync(readPath);
    res.end(indexPage);
}

function parseDns(res, req) {
    var postData = "";
    req.addListener("data", (postDataChunk) => {
        postData += postDataChunk;
    })

    req.addListener("end", () => {
        var retData = getDns(postData, (domain, address) => {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(`
            <html>

            <head>
                <title>DNS查询</title>
                <meta http-equiv="content-type" content="text/html; charset=utf-8">
            </head>
            <body>
                <div style="text-align:center">
                Domain:<span style='color:red'>${domain}</span>
                IP:<span style='color:red'>${address.join("&&")}</span>
                </div>
            </body>
                
            </html>`)
        })
    })
}

function getDns(postData, callback) {
    var domain = querystring.parse(postData).search_dns;
    dns.resolve(domain, (err, addresses) => {
        if (!addresses) {
            addresses = ["不存在域名"];
        }
        callback(domain, addresses);
    })
}