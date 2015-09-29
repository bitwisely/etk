var test = require('tape');
var elastic = require('elasticsearch');
var etk = require('../index');

var client = elastic.Client({
    hosts: [
        'localhost:9200'
    ]
});

var client_1 = new etk(client, {index: "myindex2", type: "mytype"});
var client_2 = new etk(client, {index: "myin3dex2", type: "myty3pe2"});

client_1.tk.searchLastDays("foo", 1, 20, function (err, resp) {
    console.log("1");
    console.log(JSON.stringify(resp));
});

client_1.tk.search("foo", 1, function (err, resp) {
    console.log("2");
    console.log(JSON.stringify(resp));
});

client_2.tk.searchLastDays("foo", 1, 20, function (err, resp) {
    console.log("3");
    console.log(JSON.stringify(resp));
});

client_2.tk.search("foo", 1, function (err, resp) {
    console.log("4");
    console.log(JSON.stringify(resp));
});

client_1.tk.search("foo", 1, function (err, resp) {
    console.log("5");
    console.log(JSON.stringify(resp));
});

//client_tk.tk.create({"a":1}, function(){console.log("hello")});

test("Populate the data set", function(t) {
     t.end();
});