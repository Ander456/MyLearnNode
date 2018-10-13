var fork = require("child_process").fork

var cpus = require("os").cpus()

var server = require("net").createServer()
server.listen(1337)

var workers = {}

var createWorker = function() {
	var worker = fork(__dirname + "/worker.js")

	worker.on("exit", function() {
		console.log("worker "+ worker.pid + "exited.")
		delete worker[worker.pid]
	})

	worker.on("message", function(message) {
		if (message.act == "suicide") {
			createWorker()
		}
	})

	worker.send("server", server)
	workers[workers.pid] = worker
	console.log("create worker. pid: ", worker.pid)
}

for (var i = 0; i < cpus.length; i++) {
	createWorker()
}

process.on("exit", function() {
	for (var pid in workers) {
		workers[pid].kill()
	}
})