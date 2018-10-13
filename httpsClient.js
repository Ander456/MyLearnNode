var https = require("https")

var fs = require("fs")

var options = {
	hostname: "localhost",
	port: 8000,
	path: "/",
	key: fs.readFileSync("./client.key"),
	cert: fs.readFileSync("./client.crt"),
	ca: [fs.readFileSync("./ca.crt")]
}

options.agent = new https.Agent(options);

var req = https.request(options, function(res) {
	res.setEncoding("utf-8");
	res.on("data", function(data) {
		console.log(data);
	})
})
req.end();

req.on("error", function(e) {
	console.log(e);
})
