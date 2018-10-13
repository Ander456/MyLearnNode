var util = require("util");

var Target = require("./target");

function Adapter() {
    Target.call(this);
    this.encode = function () {
        var encodeModule = arguments[0] ? arguments[0] : null,
            algorithm = arguments[1] ? arguments[1] : null,
            enstring = arguments[2] ? arguments[2] : "",
            returnType = arguments[3] ? arguments[3] : "",
            encodeKey = arguments[4] ? arguments[4] : "",
            encodeType = arguments[5] ? arguments[5] : "",
            AdapterClass = require("./adaptee_class/" + encodeModule),
            adapteeOjb = new AdapterClass();

        return adapteeOjb.encode(algorithm, enstring, returnType, encodeKey, encodeType);
    };

    this.decode = function () {
        var encodeModule = arguments[0] ? arguments[0] : null,
            algorithm = arguments[1] ? arguments[1] : null,
            enstring = arguments[2] ? arguments[2] : "",
            returnType = arguments[3] ? arguments[3] : "",
            encodeKey = arguments[4] ? arguments[4] : "",
            encodeType = arguments[5] ? arguments[5] : "",
            AdapterClass = require("./adaptee_class/" + encodeModule),
            adapteeOjb = new AdapterClass();
        return adapteeOjb.decode(algorithm, enstring, returnType, encodeKey, encodeType);
    };
}

util.inherits(Adapter, Target);

module.exports = Adapter;