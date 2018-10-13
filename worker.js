var http = require("http")

var server = http.createServer(function(req, res) {
	res.end("Handled by child, pid is " + process.pid + "\n");
	throw new Error("throw exceptioin")
})

var worker

process.on("message", function(m, tcp) {
	if (m === "server") {
		worker = tcp
		worker.on("connection", function(socket) {
			server.emit("connection", socket)
		})
	}
})

process.on("uncaughtException", function() {
	process.send({act: "suicide"})
	worker.close(function() {
		process.exit(1)
	})
	setTimeout(function() {
		process.exit(1)
	}, 5000)
})