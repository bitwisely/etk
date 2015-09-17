var test = require('tape');
var elastic = require('elasticsearch');
var etk = require('../index');


var client = etk(elastic, {index: "myindex", "type": "mytype"});

test("Populate the data set", function(t) {
     t.end();
});