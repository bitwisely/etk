## ElasticSearch Tool Kit

Makes life easy with ElasticSearch.

[![Linux Build][travis-image]][travis-url]
[![Dependency Status][david-dm-dev-image]][david-dm-dev-url]
[![devDependency Status][david-dm-devDep-image]][david-dm-devDep-url]

    elastic = require('elasticsearch');
    Etk = require('etk');

    var client = elastic.Client({hosts: ['localhost:9200']});

    var tk_1 = Etk(client, {index: "my_index", type: "my_type"});
    
    tk_1.search("foo", "bar", function (err, resp) {
        ...
    });

    var tk_2 = Etk(client, {index: "another_index", type: "another_type"});
    tk_2.search("baz", "bar", function (err, resp) {
            ...
        });

## Installation
$ npm install etk

## Features
* Extents the official [elasticsearch](https://github.com/elastic/elasticsearch-js) project with easy to use, well documented function calls.
* Parses elasticsearch error and response messages in useful ways. Yet you have the option to receive them as they are with configuration options.
* Uses same elasticsearch instance in multiple Etk clients.
* All API calls are tested against the latest elasticsearch release.
* [elasticsearch](https://github.com/elastic/elasticsearch-js) can be used alongside without any change.

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
