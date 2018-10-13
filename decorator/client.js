var ConcreteComponent = require("./concreteComponent");

var DA = require("./concreteDecoratorA");

var DB = require("./concreteDecoratorB");

var cc = new ConcreteComponent();
cc.operation();

var da = new DA(cc);
da.operation();

// var db = new DB(cc);
// db.operation();
// db.addedBehavior();