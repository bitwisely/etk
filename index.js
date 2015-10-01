
Esq = require('esq');
module.exports = Etk;

function Etk(client, opt) {
    this.client = client;
    // Add tk namespace to elastic search object.
    this.client.tk = this.client.tk || {

        /**
         * Searches the key-value pair. Returns result to the callback
         * function.
         *
         * @example
         * elastic = require('elasticsearch');
         * Etk = require('etk');
         * var client = elastic.Client({hosts: ['localhost:9200']});
         * client = Etk(client, {index: "myindex", type: "mytype"});
         * client.tk.search("foo", "bar", function (err, resp) {
         *     ...
         * });
         *
         * @param key {string} Key to search
         * @param value {string} Value of the key
         * @param cb {function} Callback function of signature (err, resp)
         */
        search: function (key, value, cb) {
            var esq = new Esq();
            esq.query("query", "filtered", "query", "match", key, value);
            var query = esq.getQuery();
            this.client.search({
                body: query},
                cb);
        },

        /**
         * Searches the key-value pair for the last number of days.
         * Returns result to the callback function.
         *
         * @example
         * elastic = require('elasticsearch');
         * Etk = require('etk');
         * var client = elastic.Client({hosts: ['localhost:9200']});
         * client = Etk(client, {index: "myindex", type: "mytype"});
         * client.tk.searchLastDays("foo", "bar", 10, function (err, resp) {
         *     ...
         * });
         *
         * @param key {string} Key to search
         * @param value {string} Value of the key
         * @param days {number} Number of days back to search
         * @param cb {function} Callback function of signature (err, resp)
         */
        searchLastDays: function (key, value, days, cb) {
            var esq = new Esq();
            var search_days = "now-" + days.toString() + "d/d";
            esq.query("query", "filtered", "query", "match", key, value);
            esq.query("query", "filtered", "filter", "range", this.time_field, "gte", search_days);
            var query = esq.getQuery();
            this.client.search({
                body: query},
                cb);
        },
        // Helper function to pack json array compatible with ElasticSearch bulk array format
        _bulkArray: function(data) {
            var bulk_formed = [];
            for (var i = 0, len = data.length; i < len; i++) {
                bulk_formed.push({index: {_index:this.index, _type: this.type}});
                bulk_formed.push(data[i]);
            }
            return bulk_formed;
        },
        /**
         * Inserts Json arrays in bulk mode
         *
         * @example
         * elastic = require('elasticsearch');
         * Etk = require('etk');
         * var client = elastic.Client({hosts: ['localhost:9200']});
         * client = Etk(client, {index: "myindex", type: "mytype"});
         *
         * var test_array= [{foo:1, bar:2, baz: "John", "@timestamp": new Date().toISOString()},
         *     {foo:2, bar:4, baz: "Dough", "@timestamp": new Date().toISOString()},
         *     {foo:0, bar:5, baz: "Jane", "@timestamp": new Date().toISOString()}];
         *
         * client.tk.bulkInsert(test_array, function (err, resp) {
         *     ...
         * });
         *
         * @param data {json} Bulk arbitrary json data
         * @param cb {function} Callback function of signature (err, resp)
         */
        bulkInsert: function(data, cb) {
            var bulk_body = this._bulkArray(data);
            console.log(bulk_body);
            client.bulk({
                body: bulk_body
            }, cb);
        }
    };

    // Store elastic search client for etk use
    this.client.tk.client = this.client;
    // Default time field is Logstash compatible
    this.client.tk.time_field = opt.time_field || "@timestamp";
    // Default searches "all" available index
    this.client.tk.index = opt.index || "*";
    // Default searches "all" available types
    this.client.tk.type = opt.type || "*";
    // Return the extended object
    return this.client;
}

var elasticsearch = require('elasticsearch');

var client = elasticsearch.Client({
    hosts: [
        'localhost:9200'
    ]
});

var client_1 = new Etk(client, {index: "myindex2", type: "mytype"});

function cb (err, resp) {
    if (err)
        console.log("ERR:" + err);

    if (resp)
        console.log(resp);
}

(function test_bulk() {
    var test_array= [{foo:1, bar:2, baz: "John", "@timestamp": new Date().toISOString()},
        {foo:2, bar:4, baz: "Dough", "@timestamp": new Date().toISOString()},
        {foo:0, bar:5, baz: "Jane", "@timestamp": new Date().toISOString()}];

    client_1.tk.bulkInsert(test_array, cb);
})();