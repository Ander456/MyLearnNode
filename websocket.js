var http = require("http")
var crypto = require("crypto")

var WebSocket = function(url) {
	// this.optioins = parseUrl(url);
	// this.connect();
}

WebSocket.prototype.onopen = function() {
	
}

WebSocket.prototype.setSocket = function(socket) {
	this.socket = socket
}

WebSocket.prototype.connect = function() {
	var that = this;
	var key = new Buffer(this.optioins.protocolVersion + "-" + Date.now()).toString('base64');
	var shasum = crypto.createHash("sha1");
	var expected = shasum.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest('base64');
	var options = {
		port: this.options.port,
		host: this.options.hostname,
		headers: {
			'Connection': 'Upgrade',
			'Upgrade': 'WebSocket',
			'Sec-WebSocket-Version': this.options.protocolVersion,
			'Sec-WebSocket-Key': key
		}
	}

	var req = http.request(options);
	req.end();
	req.on("upgrade", function(res, socket, upgradeHead) {
		this.setSocket(socket);
		that.onopen();
	})
}

var server = http.createServer(function(req, res) {
	res.end('Hello World\t\n');
})

server.listen(12010);

server.on('upgrade', function(req, socket, upgradeHead) {
	var head = new Buffer(upgradeHead.length);
	upgradeHead.copy(head);
	var key = req.headers['sec-websocket-key'];
	var shasum = crypto.createHash('sha1');
	key = shasum.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
	var headers = [
		'HTTP/1.1 101 Switching Protocols',
		'Upgrade: websocket',
		'Connection: Upgrade',
		'Sec-WebSocket-Accept: ' + key,
		'Sec-WebSocket-Protocol: Chat'
	];
	socket.setNoDelay(true);
	socket.write(headers.concat(", ").join("\r\n"));
	var websocket = new WebSocket();
	websocket.setSocket(socket);
})
