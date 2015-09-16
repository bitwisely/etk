var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');

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

gulp.task('watch', function () {
    gulp.watch('./*.js', ['jshint']);
    gulp.watch('./*.js', ['jsbuild']);
});
