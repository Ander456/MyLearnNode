var net = require("net");

var server = net.createServer(function(socket) {
	socket.on("data", function(data) {
		console.log(data.toString());
		socket.write("你好");
	});

	socket.on("end", function() {
		console.log("连接断开")
	});

	socket.write("欢迎建立tcp连接");
});

server.listen(8124, function() {
	console.log("server bound");
});