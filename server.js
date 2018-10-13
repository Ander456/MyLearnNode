var heapdump = require('heapdump')
var http = require("http")

var leakArray = [];
var leak = function() {
	for (var i = 0; i < 100000; i++) {
		leakArray.push("leak" + Math.random());
	}
}

http.createServer(function(req, res) {
	leak();
	res.end('Hello World\n');
}).listen(1337);

console.log("Server running at http:127.0.0.1:1337");