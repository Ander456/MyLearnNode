var dns = require("dns"),
    querystring = require("querystring");

exports.parseDns = function (res, req) {
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