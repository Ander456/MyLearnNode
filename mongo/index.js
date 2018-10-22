var BaseModel = require("./BaseModel"),
    bm = new BaseModel(),
    rowInfo = {},
    tableName = "node_book";

rowInfo.book_name = "nodejs book";
rowInfo.author = "alex";

rowInfo.book_name = "nodejs book1";
bm.insert(tableName, rowInfo, function (ret) {
    console.log(ret);
});