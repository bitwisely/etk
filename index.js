Esq = require('esq');
Module.exports = Etk;

function Etk(client, opt) {
    this.client = client;
    this.client.tk = this.client.tk || {
        // Quick search of items
        searchQ: function (param, cb) {
            this.client.search({
                index: this.index,
                type: this.type,
                q: param},
                cb);
        },

        search: function (key, value, cb) {
            var search_text = key + ":" + value;
            client.search({
                index: this.index,
                type: this.type,
                body: search_text},
                cb);
        },

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

        searchBetween: function (key, value, start, end, cb) {
            var json_data = {"query": {
                "filtered": {
                    "query": {
                        "match": {
                            "foo": 1
                        }
                    },

                    "filter": {
                        "numeric_range": {
                            "@timestamp": {
                                "lt": "2015-06-30",
                                "gte": "2015-06-01"
                            }}}
                }
            }};
            this.client.search({
                    body: json_data},
                cb);
        }
    };

    this.client.tk.client = this.client;
    this.client.tk.time_field = opt.time_field || "@timestamp"; // Default time field is Logstash compatible
    this.client.tk.index = opt.index || "*";
    this.client.tk.type = opt.type || "*";
    return this.client;
}
