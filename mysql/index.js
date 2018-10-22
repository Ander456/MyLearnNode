// var mysql = require("mysql");

// var connection = mysql.createConnection({
//     host: "example.org",
//     user: "alex",
//     password: "anzehao"
// });

// connection.connect(function (err) {

// });

// connection.end(function (err) {

// });

// connection.query("SELECT * FROM table", function (err, rows) {

// });

var BaseModel = require("./BaseModel"),
    bm = new BaseModel(),
    rowInfo = {},
    tableName = "node_book";

// rowInfo.book_name = "nodejs book";
// rowInfo.author = "alex";

// bm.insert("node_book", rowInfo, function (ret) {
//     console.log(ret);
// });

// var idJson = {
//     "book_id": 2
// };
// bm.findOneById(tableName, idJson, function (ret) {
//     console.log(ret);
// });

// var newInfo = {};
// newInfo.book_name = "modify nodejs book";
// newInfo.author = "mio";
// var idJson = {
//     "book_id": 2
// };
// bm.modify(tableName, idJson, newInfo, function (ret) {
//     console.log(ret);
// });

// var rmJson = {
//     "book_id": 10
// };
// bm.remove(tableName, rmJson, function (ret) {
//     console.log(ret);
// });

var whereJson = {
    'and': [{
        'key': 'book_name',
        'opts': '=',
        'value': '"nodejs"'
    }, {
        'key': 'author',
        'opts': '=',
        'value': '"alex"'
    }],
    'or': [{
        'key': 'book_id',
        'opts': '<',
        'value': 10
    }]
};

var fieldsArr = ["book_name", "author", "time"];
var orderByJson = {
    "key": "time",
    "type": "desc"
};
var limiteArr = [0, 10];
bm.find(tableName, whereJson, orderByJson, limiteArr, fieldsArr, function (ret) {
    console.log(ret);
});