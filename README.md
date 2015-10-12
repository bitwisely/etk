## ElasticSearch Tool Kit

Makes life easy with ElasticSearch.

[![Linux Build][travis-image]][travis-url]
[![Dependency Status][david-dm-dev-image]][david-dm-dev-url]
[![devDependency Status][david-dm-devDep-image]][david-dm-devDep-url]

    elastic = require('elasticsearch');
    Etk = require('etk');

    var client = elastic.Client({hosts: ['localhost:9200']});

    client_1 = Etk(client, {index: "my_index", type: "my_type"});
    client_1.tk.search("foo", "bar", function (err, resp) {
        ...
    });

    client_2 = Etk(client, {index: "another_index", type: "another_type"});
    client_2.tk.search("baz", "bar", function (err, resp) {
            ...
        });

## Installation
$ npm install etk

## Features
* Extents the official [elasticsearch](https://github.com/elastic/elasticsearch-js) project with easy to use, well documented function calls.
* Etk library is inserted into elasticsearch with "tk" namespace.
* Uses same elasticsearch instance in multiple Etk clients.
* All API calls are tested against the latest elasticsearch release.
* Elasticsearch can be used alongside without any change.

## API Documentation with Examples
[Site-Link](http://saltukalakus.github.io/etk)

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
