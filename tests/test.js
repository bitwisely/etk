var test = require('tape');
var elastic = require('elasticsearch');
var Etk = require('../index');

var client = elastic.Client({
    hosts: [
        'localhost:9200'
    ]
});

// First test data set is stored in myindex-mytype index/type store
var tk_1 = new Etk(client, {index: "myindex", type: "mytype"});
// Second test data set is stored in myuser-myname index/type store
var tk_2 = new Etk(client, {index: "myuser", type: "myname"});

/*

tk_1.searchLastDays("foo", 1, 20, function (err, resp) {
    console.log("1");
    console.log(JSON.stringify(resp));
});

tk_1.search("foo", 1, function (err, resp) {
    console.log("2");
    console.log(JSON.stringify(resp));
});

tk_2.searchLastDays("foo", 1, 20, function (err, resp) {
    console.log("3");
    console.log(JSON.stringify(resp));
});

tk_2.search("foo", 1, function (err, resp) {
    console.log("4");
    console.log(JSON.stringify(resp));
});

tk_1.search("foo", 1, function (err, resp) {
    console.log("5");
    console.log(JSON.stringify(resp));
});

*/

var test_array_1= [{foo:1, bar:2, baz: "John", "@timestamp": new Date().toISOString(), "id" : 1},
    {foo:2, bar:4, baz: "Dough", "@timestamp": new Date().toISOString(), "id": 2},
    {foo:0, bar:5, baz: "Jane", "@timestamp": new Date().toISOString(), "id": 3}];

var test_array_2= [{woman:"Mary", "man":"John", "id" : 1},
    {woman:"Curry", "man":"Tesla", "id" : 2},
    {woman:"Jane", "man":"Bob", "id" : 3}];

test("Delete data set - 1", function(t) {
    function cb (err, resp) {
        if (err)
            t.fail("ERR: " + JSON.stringify(err));
    }
    tk_1.deleteAll(function(err, resp){
        if (err) {
            t.fail("Data set could not be cleared. ERR: " + JSON.stringify(err));
        }
    });
    t.end();
});

test("Delete data set - 2", function(t) {
    function cb (err, resp) {
        if (err)
            t.fail("ERR: " + JSON.stringify(err));
    }
    tk_2.deleteAll(function(err, resp){
        if (err) {
            t.fail("Data set could not be cleared. ERR: " + JSON.stringify(err));
        }
    });
    t.end();
});

test("Populate the data set - 1", function(t) {
    function cb (err, resp) {
        if (err)
            t.fail("ERR: " + JSON.stringify(err));
    }
    tk_1.deleteAll(function(err, resp){
        if (err) {
            t.fail("Data set could not be cleared. ERR: " + JSON.stringify(err));
        }
        console.log("Now bulk insert");
        tk_1.bulkInsert(test_array_1, cb);
    });
    t.end();
});

test("Populate the data set - 2", function(t) {
    function cb (err, resp) {
        if (err)
            t.fail("ERR: " + JSON.stringify(err));
    }
    tk_2.deleteAll(function(err, resp){
        if (err) {
            t.fail("Data set could not be cleared. ERR: " + JSON.stringify(err));
        }
        console.log("Now bulk insert");
        tk_2.bulkInsert(test_array_2, cb);
    });
    t.end();
});

test("Verify if the data set is successfully stored for set - 1", function(t) {
    t.plan(3);

    function cb (err, resp) {
        if (err) {
            t.fail("ERR: " + JSON.stringify(err));
        }

        for (var item in resp) {
            t.equal(JSON.stringify(test_array_1[item]), JSON.stringify(resp[item]));
        }
    }

    setTimeout(function() {
        // Give elastic search some time to index
        tk_1.listAll(cb, {"sort": "id"});
    }, 3000);
});

/*
test("Verify in raw response mode, if the data set is successfully stored", function(t) {
    t.plan(3);

    function cb (err, resp) {
        if (err) {
            t.fail("ERR: " + JSON.stringify(err));
        }

       for (var item in resp['hits']['hits']) {
            t.equal(JSON.stringify(test_array_1[item]), JSON.stringify(resp['hits']['hits'][item]['_source']));
        }
    }

    setTimeout(function() {
        // Give elastic search some time to index
        tk_1.listAll(cb, {"sort": "id", "raw_response": true});
    }, 3000);
});
*/

test("Search the data set with success", function(t){
    function cb(err, resp) {
        if (err) {
            t.fail("ERR: " + JSON.stringify(err));
        }
    }

    setTimeout(function() {
        //tk_1.search(cb, )
    }, 3000);
    t.end();
});

test("Search should find only in defined index-type pair", function(t){
    t.end();
});
