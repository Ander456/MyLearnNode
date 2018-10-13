var crypto = require("crypto"),
    key = "salt",
    plaintext = "alex",
    cipher = crypto.createCipher("aes-256-cbc", key),
    decipher = crypto.createDecipher("aes-256-cbc", key);

var hash = crypto.createHash("md5");

hash.update(new Buffer("alex", "binary"));

var encode = hash.digest("hex");

console.log(encode);

cipher.update(plaintext, "utf8", "hex");
var encryptedPassword = cipher.final("hex");

decipher.update(encryptedPassword, "hex", "utf8");
var decryptedPassword = decipher.final("utf8");


console.log("encrypted :", encryptedPassword);
console.log("decrypted :", decryptedPassword);