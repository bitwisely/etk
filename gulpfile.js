var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var shell = require('gulp-shell');

gulp.task('jshint', function () {
    gulp.src('./*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Browserify
gulp.task('jsbuild', function() {
    gulp.src('.index.js')
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./public/build'))
});

// Document the API
gulp.task('document', shell.task([
    'cp ./confs/jsdoc-conf.json ./node_modules/jsdoc/conf.json',
    './node_modules/jsdoc/jsdoc.js index.js \
     -t ./node_modules/ink-docstrap/template \
     -c ./node_modules/jsdoc/conf.json',
    './node_modules/docco/bin/docco index.js'
]));

gulp.task('watch', function () {
    gulp.watch('./*.js', ['jshint']);
    gulp.watch('./*.js', ['jsbuild']);
});
