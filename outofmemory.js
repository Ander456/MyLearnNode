var showMem = function() {
	var mem = process.memoryUsage();
	var format = function(bytes) {
		return (bytes / 1024 / 1024).toFixed(2) + " MB";
	}
	console.log("Process: heapTotal " + format(mem.heapTotal) + " heapUsed " + format(mem.heapUsed) + " rss " + format(mem.rss));
	console.log("----------------------------------")
}

var useMem = function() {
	// var size = 20 * 1024 * 1024;
	// var arr = new Array(size);
	var size = 200 * 1024 * 1024;
	var buffer = new Buffer(size);
	for (var i = 0; i < size; i++) {
		// arr[i] = 0;
		buffer[i] = 0;
	}
	// return arr;
	return buffer;
}

var total = [];

for (var i = 0; i < 15; i++) {
	showMem();
	total.push(useMem());
}

showMem();