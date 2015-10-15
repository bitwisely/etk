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
// In this set etk instance passes elasticsearch error and response messages
// untouched
var tk_2 = new Etk(client, {index: "another_index",
                            type: "another_type",
                            raw_response: true,
                            raw_error: false});

var test_array_1= [
    {foo:1, bar:2, baz: "John", "@timestamp": new Date().toISOString(), "id" : 1},
    {foo:2, bar:4, baz: "Dough", "@timestamp": new Date().toISOString(), "id": 2},
    {foo:0, bar:5, baz: "Jane", "@timestamp": new Date().toISOString(), "id": 3},
    {foo:1, bar:5, baz: "James", "@timestamp": new Date().toISOString(), "id": 4},
    {foo:3, bar:6, baz: "Jany", "@timestamp": new Date().toISOString(), "id": 5}
];

var test_array_2= [
    {woman:"Mary", man:"John", "id" : 1},
    {woman:"Curry", man:"Tesla", "id" : 2},
    {woman:"Jane", man:"Bob", "id" : 3},
    {foo:1, man:"Bob", "id" : 4}
];

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

test("Populate data set - 1", function(t) {
    function cb (err, resp) {
        if (err)
            t.fail("ERR: " + JSON.stringify(err));
    }
    tk_1.deleteAll(function(err, resp){
        if (err) {
            t.fail("Data set could not be cleared. ERR: " + JSON.stringify(err));
        }
        tk_1.bulkInsert(test_array_1, cb);
    });
    t.end();
});

test("Populate data set - 2", function(t) {
    function cb (err, resp) {
        if (err)
            t.fail("ERR: " + JSON.stringify(err));
    }
    tk_2.deleteAll(function(err, resp){
        if (err) {
            t.fail("Data set could not be cleared. ERR: " + JSON.stringify(err));
        }
        tk_2.bulkInsert(test_array_2, cb);
    });
    t.end();
});

test("Verify data set - 1", function(t) {
    function cb (err, resp) {
        if (err) {
            t.fail("ERR: " + JSON.stringify(err));
        }

        var response_source = resp.source();
        for (var i in response_source) {
            // Skip time field only
            t.equal(response_source[i].foo, test_array_1[i].foo);
            t.equal(response_source[i].bar, test_array_1[i].bar);
            t.equal(response_source[i].baz, test_array_1[i].baz);
            t.equal(response_source[i].id, test_array_1[i].id);
        }
    }

    setTimeout(function() {
        // Give elastic search some time to index newly stored data set
        tk_1.listAll(cb, {"sort": "id"});
    }, 3000);

    t.end();
});

test("Verify data set - 2", function(t) {
    t.plan(4);

    function cb (err, resp) {
        if (err) {
            t.fail("ERR: " + JSON.stringify(err));
        }

       // Response is in raw form. So application should handle elasticsearch's crappy json format.
       for (var item in resp['hits']['hits']) {
            t.equal(JSON.stringify(resp['hits']['hits'][item]['_source']), JSON.stringify(test_array_2[item]));
        }
    }

    setTimeout(function() {
        // Give elastic search some time to index newly stored data set
        tk_2.listAll(cb, {"sort": "id"});
    }, 3000);
});


test("Search the data set with success", function(t){
    function cb(err, resp) {
        if (err) {
            t.fail("ERR: " + JSON.stringify(err));
        }

        var expected_source = [
            {foo:1,bar:2,baz:"John", id:1},
            {foo:1,bar:5,baz:"James",id:4}
        ];

        // Check item count matches
        console.log(JSON.stringify(resp.resp));
        t.equal(resp.hits(), expected_source.length);

        // Check for each item that we received the data correctly
        var response_source = resp.source();
        for (var i in response_source) {
            // Skip time field only
            t.equal(response_source[i].foo, expected_source[i].foo);
            t.equal(response_source[i].bar, expected_source[i].bar);
            t.equal(response_source[i].baz, expected_source[i].baz);
            t.equal(response_source[i].id, expected_source[i].id);
        }

        // Check score (when sort is enabled score appears to be null)
        var expected_score = [null, null];
        var response_score = resp.score();
        for (var j in response_score) {
            t.equal(response_score[j], expected_score[j]);
        }
    }

    tk_1.search("foo", "1", cb, {"sort":"id"});
    t.end();
});

test("Search should return empty object when no result is found.", function(t){
    function cb(err, resp) {
        if (err) {
            t.fail("ERR: " + JSON.stringify(err));
        }

        console.log(JSON.stringify(resp.resp));

        var expected_source = [];

        // Check item count matches
        t.equal(resp.hits(), expected_source.length, "item count does not match");

        // Check for each item that we received the data correctly
        var response_source = resp.source();
        for (var i in response_source) {
            // Skip time field only
            t.equal(response_source[i].foo, expected_source[i].foo);
            t.equal(response_source[i].bar, expected_source[i].bar);
            t.equal(response_source[i].baz, expected_source[i].baz);
            t.equal(response_source[i].id, expected_source[i].id);
        }

        // Check score (when sort is enabled score appears to be null)
        var expected_score = [null];
        var response_score = resp.score();
        for (var j in response_score) {
            t.equal(response_score[j], expected_score[j]);
        }
    }

    tk_1.search("fuzz", "1", cb);
    t.end();
});


test("Search should find only in defined index-type pair", function(t){
    t.end();
});

/*

 tk_1.searchLastDays("foo", 1, 20, function (err, resp) {
 console.log("1");
 console.log(JSON.stringify(resp));
 });

 tk_2.searchLastDays("foo", 1, 20, function (err, resp) {
 console.log("3");
 console.log(JSON.stringify(resp));
 });

 */
