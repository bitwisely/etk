## ElasticSearch Tool Kit

Makes life easy with ElasticSearch.

[![Linux Build][travis-image]][travis-url]
[![Dependency Status][david-dm-dev-image]][david-dm-dev-url]
[![devDependency Status][david-dm-devDep-image]][david-dm-devDep-url]

    elastic = require('elasticsearch');
    Etk = require('etk');

    // Elasticsearch instance is initialized with some common options
    var client = elastic.Client({hosts: ['localhost:9200']});

    // Instance "tk_1" makes Elasticsearch searches against index = my_index
    // and type = my_type
    var tk_1 = Etk(client, {index: "my_index", type: "my_type"});
    tk_1.search("foo", "bar", function (err, resp) {
        ...
    });

    // Instance "tk_2" forwards elasticsearch error and response messages
    // to application. See class documentation for full 
    // list of Etk options you can configure
    var tk_2 = Etk(client, {index: "another_index",
                            type: "another_type",
                            raw_response: true,
                            raw_error: true});
    tk_2.search("baz", "bar", function (err, resp) {
            // Application should handle raw error and response messages
            // received from elasticsearch.
            ...
        });

## Installation
$ npm install etk

## Features
* Provides high level, easy to use interface to use Elastic Search in your Node.js & Io.js project.
* Etk extents the official [elasticsearch](https://github.com/elastic/elasticsearch-js) project with well documented function calls.
* Parses [elasticsearch](https://github.com/elastic/elasticsearch-js) error and response messages in useful ways. Yet you have the option to receive them as they are with configuration options.
* Uses same [elasticsearch](https://github.com/elastic/elasticsearch-js) instance in multiple Etk clients.
* All API calls are tested against the latest [elasticsearch](https://github.com/elastic/elasticsearch-js) release.
* [Elasticsearch](https://github.com/elastic/elasticsearch-js) can be used alongside with Etk without any code change.

## API Documentation with Examples
[Site Link](http://saltukalakus.github.io/etk)

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
