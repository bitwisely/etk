var test = require('tape');
var elastic = require('elasticsearch');
var etk = require('../index');

var client = elastic.Client({
    hosts: [
        'localhost:9200'
    ]
});
client = etk(client, {index: "myindex", type: "mytype"});

client.tk.searchLastDays("foo", 1, 20, function (err, resp) {
    //console.log(resp);
});

client.tk.search("foo", 1, function (err, resp) {
    console.log(resp);
});

//client_tk.tk.create({"a":1}, function(){console.log("hello")});

test("Populate the data set", function(t) {
     t.end();
});