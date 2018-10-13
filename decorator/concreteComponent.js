var util = require('util');
var Component = require("./component");

function ConcreteComponent() {
    Component.call(this);
    this.operation = function () {
        console.log("output by the concreate component");
    };
}

util.inherits(ConcreteComponent, Component);

module.exports = ConcreteComponent;