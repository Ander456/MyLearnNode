var util = require("util");
var Target = require("./target");
var Adaptee = require("./adaptee");


function Adapter() {
    Target.call(this); // 这其实就是调用父类的构造函数
    this.request = function () {
        var adapteObj = new Adaptee();
        adapteObj.speicialRequest();
    };
}

util.inherits(Adapter, Target);

module.exports = Adapter;