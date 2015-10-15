## ElasticSearch Tool Kit

Makes life easy with ElasticSearch.

[![Linux Build][travis-image]][travis-url]
[![Dependency Status][david-dm-dev-image]][david-dm-dev-url]
[![devDependency Status][david-dm-devDep-image]][david-dm-devDep-url]

    elastic = require('elasticsearch');
    Etk = require('etk');

    // Elasticsearch instance is initialized as documented at it's
    // project space
    var client = elastic.Client({hosts: ['localhost:9200']});

    // Etk instance "tk_1" calls against index = my_index and type = my_type
    var tk_1 = Etk(client, {index: "my_index", type: "my_type"});

    // search Etk API call returns back the search result
    tk_1.search("foo", "bar", function (err, resp) {

        // Etk inserts "source()" method to response, so you can easily get 
        // the data array found in search
        console.log(JSON.stringify(resp.source());
        
        // Etk inserts "score()" method to response, so you can easily get 
        // the score array found in search
        console.log(JSON.stringify(resp.score());
                
        // elasticsearch original response can be reached from resp.resp 
        // for further data manipulation for special cases.
        console.log(JSON.stringify(resp.resp);
    });

    // Etk instance "tk_2" forwards elasticsearch error and response messages
    // to application. See class documentation for full list of options
    // you can configure
    var tk_2 = Etk(client, {index: "another_index",
                            type: "another_type",
                            raw_response: true,
                            raw_error: true});

    // search Etk API call returns back the search result
    tk_2.search("baz", "bar", function (err, resp) {

            // Application should handle raw error and response messages
            // received from elasticsearch.
            ...
    });

## Installation
$ npm install etk

## Features
* Provides high level, easy to use interface for Elastic Search in your Node.js project.
* Etk extents the official [elasticsearch](https://github.com/elastic/elasticsearch-js) project with well documented function calls.
* Parses [elasticsearch](https://github.com/elastic/elasticsearch-js) error and response messages in useful ways. Yet you have the option to receive them as they are with configuration options.
* Uses same [elasticsearch](https://github.com/elastic/elasticsearch-js) instance in multiple Etk clients.
* All API calls are tested against the latest [elasticsearch](https://github.com/elastic/elasticsearch-js) release.
* [Elasticsearch](https://github.com/elastic/elasticsearch-js) can be used alongside with Etk without any code change.

## API Documentation with Examples
[Project site](http://saltukalakus.github.io/etk) documents the latest NPM release.

## TODO
* Currently project covers a very small subset of possible function calls. Please extend the library and open a pull request for merge.
* Promise support is missing. Only callback mechanism is implemented.
* Browser support is not available yet.

## People

Original author of Etk is [R. Saltuk Alakus](https://github.com/saltukalakus)

Looking for maintainers. Please drop me an email at saltukalakus@gmail.com

## License

[MIT](LICENSE)

[travis-image]: https://travis-ci.org/saltukalakus/etk.svg?branch=master
[travis-url]: https://travis-ci.org/saltukalakus/etk
[david-dm-dev-image]: https://david-dm.org/saltukalakus/etk.svg?style=flat
[david-dm-dev-url]: https://david-dm.org/saltukalakus/etk
[david-dm-devDep-image]: https://david-dm.org/saltukalakus/etk/dev-status.svg?style=flat
[david-dm-devDep-url]: https://david-dm.org/saltukalakus/etk#info=devDependencies
