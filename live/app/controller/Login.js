module.exports = function () {
    var _res = arguments[0];
    var _req = arguments[1];
    this.checkSession = function (model) {
        if (model == "login") {
            return true;
        } else if (sessionLib.username && sessionLib.username != "") {
            return true;
        }
        return false;
    };
    this.login = function () {
        lib.httpParam.POST("username", function (value) {
            sessionLib.username = value;
            if (value == "alex") {
                _res.render(VIEW + "live.jade", {
                    "user": value
                });
            } else {
                _res.render(VIEW + "main.jade", {
                    "user": value
                });
            }
            var time = 0;
            io.sockets.on("connection", function (socket) {
                var useranme = sessionLib.username;
                var refresh_onlie = function () {
                    var n = [];
                    for (var i in onlineList) {
                        n.push(i);
                    }
                    var message = lib.fs.readFileSync(BASE_DIR + "/live_data.txt", "utf-8");
                    socket.emit("live_data", message);
                    io.sockets.emit("online_list", n); //广播所有人
                };
                refresh_onlie();
                if (time > 0) {
                    return;
                }
                socket.on("public", function (data) {
                    // var insertMsg = `
                    // <li><span class="icon-user></span><span class="live_user_name text-success">[alex]</span><span class="live_message text-info">
                    // `;
                });
                socket.on("disconnect", function () {
                    delete onlineList[username];
                    refresh_onlie();
                });
                time++;
            });
        });
    };
};