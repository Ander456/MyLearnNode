var http = require("http");

http.createServer(function(req, res) {
	res.end("hello world\t\n");
}).listen(1337, "127.0.0.1");

console.log("server running at http http://127.0.0.1:1337/")