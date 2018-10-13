var http = require("http");

var helloworld = "";

for (var i = 0; i < 1024; i++) {
	helloworld += "a";
}

helloworld = Buffer.from(helloworld);

http.createServer(function(req, res) {
	res.end(helloworld)
}).listen(8001)

