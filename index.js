
Esq = require('esq');
_ = require('lodash');

module.exports = Etk;

/**
 * @class Etk
 * Etk client. Appended to Elastic Search instance with "tk" namespace.
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
 * @param client {object} elasticsearch instance
 * @param [opt] {json} Configuration options for Etk instance. </p>
 *
 * <strong>index</strong> {string} Index which Etk operates on. Default is <strong>*</strong> </p>
 * <strong>type</strong>: {string} Type which Etk operated on. Default is <strong>*</strong> </p>
 * <strong>raw_response</strong>: {bool} Returns elasticsearch response object without any modification. Default is <strong>false</strong>. </p>
 * <strong>raw_error</strong>: {bool} Returns elasticsearch error object without any modification. Default is <strong>false</strong>. </p>
 * <strong>insert_time</strong>: {bool} Inserts time field for every stored object to elasticsearch. Default is <strong>false</strong>. </p>
 * <strong>time_field</strong>: {string} Timestamp name which is auto inserted to all stored fields.
 * Default is <strong>@timestamp</strong> which is Logstash compatible. </p>
 */
function Etk(client, opt) {
    // Insert elasticsearch with "e" namespace
    this.e = client;
    // Insert Etk API with "tk" namespace
    this.tk = {
        _query : function (query_body, opt) {
            var query = {index: this.index, type: this.type, body: query_body};
            if (opt) {
                _.merge(query, opt);
            }
            return query;
        },

        /**
         * Searches the key-value pair of Etk client. Returns result to the callback
         * function.
         *
         * @example
         * elastic = require('elasticsearch');
         * Etk = require('etk');
         * var client = elastic.Client({hosts: ['localhost:9200']});
         * client = Etk(client, {index: "myindex", type: "mytype"});
         * client.tk.search("foo", "bar", function (err, resp) {
         *     ...
         * }, {"sort":"FIELD_NAME"});
         *
         * @param key {string} Key to search
         * @param value {string} Value of the key
         * @param cb {function} Callback function of signature (err, resp)
         * @param [opt] {json} Additional options for search like "sort" for sorted results.
         * Pass options as documented in elasticsearch.
         */
        search: function (key, value, cb, opt) {
            var esq = new Esq();
            esq.query("query", "filtered", "query", "match", key, value);
            var query_body = esq.getQuery();
            var query = this._query(query_body, opt);
            this.client.search(query, cb);
        },

        /**
         * Searches the key-value pair for the last number of days of Etk client
         * Returns result to the callback function.
         *
         * @example
         * elastic = require('elasticsearch');
         * Etk = require('etk');
         * var client = elastic.Client({hosts: ['localhost:9200']});
         * client = Etk(client, {index: "myindex", type: "mytype"});
         * client.tk.searchLastDays("foo", "bar", 10, function (err, resp) {
         *     ...
         * }, {"sort":"FIELD_NAME"});
         *
         * @param key {string} Key to search
         * @param value {string} Value of the key
         * @param days {number} Number of days back to search
         * @param cb {function} Callback function of signature (err, resp)
         * @param [opt] {json} Additional options for search like "sort" for sorted results.
         * Pass options as documented in elasticsearch.
         */
        searchLastDays: function (key, value, days, cb, opt) {
            var esq = new Esq();
            var search_days = "now-" + days.toString() + "d/d";
            esq.query("query", "filtered", "query", "match", key, value);
            esq.query("query", "filtered", "filter", "range", this.time_field, "gte", search_days);
            var query_body = esq.getQuery();
            var query = this._query(query_body, opt);
            this.client.search(query, cb);
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
         * Inserts Json arrays in bulk mode to the Etk client
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
         * @param data {array} Array of bulk arbitrary json data
         * @param cb {function} Callback function of signature (err, resp)
         */
        bulkInsert: function(data, cb) {
            var bulk_body = this._bulkArray(data);
            this.client.bulk({
                body: bulk_body
            }, cb);
        },
        /**
         * Delete all items of Etk client
         *
         * @example
         * elastic = require('elasticsearch');
         * Etk = require('etk');
         * var client = elastic.Client({hosts: ['localhost:9200']});
         * client = Etk(client, {index: "myindex", type: "mytype"});
         *
         * client.tk.deleteAll(function (err, resp) {
         *     ...
         * });
         *
         * @param cb {function} Callback function of signature (err, resp)
         */
        deleteAll: function(cb, opt) {
            var esq = new Esq();
            esq.query("query", "filtered", "query", "match_all", "", "");
            var query_body = esq.getQuery();
            var query = this._query(query_body, opt);
            this.client.deleteByQuery(query, this._deleteAllCb(cb, this));
        },
        _deleteAllCb: function (cb, self) {
            var self = self;
            return function(err, resp) {
                if (err && !self.raw_error) {
                    if (err["status"] == "404") {
                        // If index is not found deleting sould not return error.
                        cb(false, {});
                    } else {
                        cb(err, resp);
                    }
                } else {
                    cb(err, resp);
                }
            }
        },
        /**
         * Get all items of Etk client
         *
         * @example
         * elastic = require('elasticsearch');
         * Etk = require('etk');
         * var client = elastic.Client({hosts: ['localhost:9200']});
         * client = Etk(client, {index: "myindex", type: "mytype"});
         *
         * client.tk.listAll(function (err, resp) {
         *     ...
         * }, {"sort":"FIELD_NAME"});
         *
         * @param cb {function} Callback function of signature (err, resp)
         * @param [opt] {json} Additional options for search like "sort" for sorted results.
         * Pass options as documented in elasticsearch.
         */
        listAll: function(cb, opt) {
            var esq = new Esq();
            esq.query("query", "filtered", "query", "match_all", "", "");
            var query_body = esq.getQuery();
            var query = this._query(query_body, opt);
            this.client.search(query, this._listAllCb(cb, this));
        },
        _listAllCb: function (cb, self) {
            var self = self;
            return function(err, resp) {
                if (err) {
                    cb(err, resp);
                } else {
                    if (self.raw_response) {
                        cb(err, resp);
                    } else {
                        // Return only the data as array
                        var resp_array = [];
                        for (var item in resp['hits']['hits']) {
                            resp_array.push(resp['hits']['hits'][item]['_source']);
                        }
                        cb(err, resp_array);
                    }
                }
            }
        }
    };

    // Store elastic search client for etk use
    this.tk.client = this.e;

    // Etk options
    this.tk.index = opt.index || "*";
    this.tk.type = opt.type || "*";
    this.tk.raw_response = opt.raw_response || false;
    this.tk.raw_error = opt.raw_error || false;
    this.tk.insert_time = opt.insert_time || false;
    // Default time field is Logstash compatible
    this.tk.time_field = opt.time_field || "@timestamp";
}