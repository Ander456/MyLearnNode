var Uitl = require("./util"),
    mysql = require("mysql"),
    dbClient;

module.exports = function () {
    __constructor();

    this.findOneById = function (tableName, idJson, callback) {
        dbClient.query("SELECT * FROM " + tableName + " where？", idJson, function (err, ret) {
            if (err) {
                console.log("GetDate Error : ", err.message);
                dbClient.end();
                callback(false);
            } else {
                if (ret) {
                    callback(ret.pop());
                } else {
                    callback(ret);
                }
            }
        });
    };

    this.insert = function (tableName, rowInfo, callback) {
        dbClient.query("INSERT INTO " + tableName + " SET ?", rowInfo, function (err, result) {
            if (err) {
                throw err;
            }
            callback(result.insertId);
        });
    };

    this.modify = function (tableName, idJson, rowInfo, callback) {
        dbClient.query("update " + tableName + " SET? where?", [rowInfo, idJson], function (err, ret) {
            if (err) {
                console.log("ClientReady Error: " + err.message);
                dbClient.end();
                callback(false);
            } else {
                callback(ret);
            }
        });
    };

    this.remove = function (tableName, idJson, callback) {
        dbClient.query("delete from " + tableName + " where?", idJson, function (err, ret) {
            if (err) {
                console.log("ClientReady Error: " + err.message);
                dbClient.end();
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    /**
     * tableName string 表名
     * whereJson json desc and和or区别，其中的条件为key，连续符大鱼小鱼还是等于value值
     * orderByJson json desc ({"key": "time", "type": "desc"})
     * limitArr array desc 第一个元素是返回偏移量 第二个元素是返回数量如果为空则全部返回
     * fieldsArr array desc 返回那些字段
     * callback 回调函数
     */
    this.find = function (tableName, whereJson, orderByJson, limitArr, fieldsArr, callback) {
        var andWhere = whereJson.and,
            orWhere = whereJson.or,
            andArr = [],
            orArr = [];

        var i = 0;
        for (i = 0; i < andWhere.length; i++) {
            andArr.push(andWhere[i].key + andWhere[i].opts + andWhere[i].value);
        }
        for (i = 0; i < orWhere.length; i++) {
            orArr.push(orWhere[i].key + orWhere[i].opts + orWhere[i].value);
        }
        var fieldsStr = fieldsArr.length > 0 ? fieldsArr.join(",") : "*",
            andStr = andArr.length > 0 ? andArr.join(" and ") : "",
            orStr = orArr.length > 0 ? " or " + orArr.join(" or ") : "",
            limitStr = limitArr.length > 0 ? " limit " + limitArr.join(",") : "",
            orderStr = orderByJson ? " order by " + orderByJson.key + " " + orderByJson.type : "";

        var sql = "SELECT " + fieldsStr + " FROM " + tableName + " where " + andStr + orStr + orderStr + limitStr;
        console.log(sql);
        dbClient.query(sql, function (err, ret) {
            if (err) {
                console.log("ClientReady Error: " + err.message);
                dbClient.end();
                callback(false);
            } else {
                callback(ret);
            }
        });
    };

    function __constructor() {
        var dbConfig = Uitl.get("config.json", "db");
        var client = {};
        client.host = dbConfig.host;
        client.port = dbConfig.port;
        client.user = dbConfig.user;
        client.password = dbConfig.password;
        dbClient = mysql.createConnection(client);
        dbClient.connect();
        dbClient.query("USE " + dbConfig.dbName, function (error, results) {
            if (error) {
                console.log("ClientConnectionReay Error: " + error.message);
                dbClient.end();
            } else {
                console.log("connection local mysql success");
            }
        });
    }
};