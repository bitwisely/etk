var test = require('tape');
var elastic = require('elasticsearch');
var etk = require('../index');

var client = elastic.Client({
    hosts: [
        'localhost:9200'
    ]
});

var client_1 = new etk(client, {index: "myindex", type: "mytype"});

/*
//var client_2 = new etk(client, {index: "myin3dex2", type: "myty3pe2"});

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

*/

var test_array= [{foo:1, bar:2, baz: "John", "@timestamp": new Date().toISOString(), "id" : 1},
    {foo:2, bar:4, baz: "Dough", "@timestamp": new Date().toISOString(), "id": 2},
    {foo:0, bar:5, baz: "Jane", "@timestamp": new Date().toISOString(), "id": 3}];

test("Populate the data set", function(t) {
    function cb (err, resp) {
        if (err)
            t.fail("ERR: " + JSON.stringify(err));
    }
    client_1.tk.deleteAll(function(err, resp){
        if (err) {
            t.fail("Data set could not be cleared. ERR: " + JSON.stringify(err));
        }
        console.log("Now bulk insert");
        client_1.tk.bulkInsert(test_array, cb);
    });
    t.end();
});

test("Verify if the data set is successfully stored", function(t) {
    t.plan(3);

    function cb (err, resp) {
        if (err) {
            t.fail("ERR: " + JSON.stringify(err));
        }

        console.log(JSON.stringify(resp));

        for (var item in resp['hits']['hits']) {
            t.equal(JSON.stringify(test_array[item]), JSON.stringify(resp['hits']['hits'][item]['_source']));
        }
    }

    setTimeout(function() {
        // Give elastic search some time to index
        client_1.tk.listAll(cb, {"sort": "id"});
    }, 3000);
});

test("Search the data set with success", function(t){
    setTimeout(function() {
        console.log('Blah blah blah blah extra-blah');
    }, 3000);
    t.end();
});

test("Search should find only in defined index-type pair", function(t){
    t.end();
});
