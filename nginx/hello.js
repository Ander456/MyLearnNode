var http = require("http"),
    fs = require("fs"),
    url = require("url");

http.createServer(function (req, res) {
    var readPath = __dirname + "/" + url.parse("index.html").pathname;
    var indexPage = fs.readFileSync(readPath);
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(indexPage);
}).listen(8000);

console.log("server running at http:127.0.0.1:8000");

// 其实这个 模块 主要是 用nginx 来配置location的静态文件配置 不用自己手动写了 
/*
    server {
        listen 80;
        server_name  www.alex.com;

        access_log  logs/access.log  main; #注意这里的路径都是nginx那个bin的同级目录
        error_log   logs/error.log;

        location / {
            proxy_pass http://127.0.0.1:8000;
        }

        location ~ .*\.(html|htm|gif|jpg|jpeg|bmp|png|ico|txt|js|css)$ {
            root    static;
            expires 24h;
        }
    }
*/