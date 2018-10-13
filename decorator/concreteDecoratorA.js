var util = require("util");

var Decorator = require("./decorator");

// 其实简单的理解就是依赖注入的方式 传参 把需要装饰的东西传进来 然后原接口不动 再包装
function ConcreteDecoratorA(component) {
    Decorator.call(this);
    this.operation = function () {
        component.operation();
        console.log("add some decorator by ConcreteDecoratorA");
    };
}

util.inherits(ConcreteDecoratorA, Decorator);

module.exports = ConcreteDecoratorA;