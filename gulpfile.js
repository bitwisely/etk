var fs = require('fs');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var shell = require('gulp-shell');
var replace = require('gulp-replace');
var markdown = require('gulp-markdown');
var ghPages = require('gulp-gh-pages');
var tape = require('gulp-tape');
var tapColorize = require('tap-colorize');

gulp.task('test', function() {
    return gulp.src('tests/*.js')
        .pipe(tape({
            reporter: tapColorize()
        }));
});

gulp.task('lint', function () {
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
        .pipe(gulp.dest('./public/build'));
});

// Document the API
gulp.task('api_document', shell.task([
    'cp ./confs/jsdoc/jsdoc-conf.json ./node_modules/jsdoc/conf.json',
    /*jshint multistr: true */
    './node_modules/jsdoc/jsdoc.js index.js\
     -t ./node_modules/ink-docstrap/template\
     -c ./node_modules/jsdoc/conf.json'
]));

gulp.task('annotate_document', shell.task([
    './node_modules/docco/bin/docco index.js'
]));

// Convert markdown to html for README.md
gulp.task('index_markdown_2_html', function () {
    return gulp.src('README.md')
        .pipe(markdown())
        .pipe(gulp.dest('.'));
});

// Document main web site patches
gulp.task('patch_index_html_document', ['api_document', 'index_markdown_2_html'], function(){
    var data = fs.readFileSync('README.html');
    gulp.src(['out/index.html'])
        .pipe(replace("</body>\n</html>",
                "<style> .type-signature { font-size:50px;} .page-title {display: none;}</style>" +
                "<script type='text/javascript' src='scripts/jquery-watch-element.js'></script>" +
                "<script>$( document ).ready(function(){$('.toc-h1').waitUntilExists(" +
                "function(){$('#toc').hide();}," +
                "false, true);});" +
                "</script>" +
                '<a href="https://github.com/saltukalakus/etk"><img style="position: fixed; top: 0; left: 0; border: 0; z-index: 999999" src="https://camo.githubusercontent.com/121cd7cbdc3e4855075ea8b558508b91ac463ac2/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f677265656e5f3030373230302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_green_007200.png"></a>' +
                "</body>\n</html>"
        ))
        .pipe(replace('<div class="clearfix"></div>',
            '<div class="clearfix"></div>' + data
        ))
        .pipe(replace("Global", "API"))
        .pipe(gulp.dest('out'));
});

// Document api web site patches
gulp.task('patch_api_document', ['patch_index_html_document'], function(){
    gulp.src(['out/global.html'])
        .pipe(replace("</body>\n</html>",
            "<style> .type-signature { font-size:60px;} .signature {color: orange;} .page-title {display: none;}</style>" +
            "<script type='text/javascript' src='scripts/jquery-watch-element.js'></script>" +
            "<script>$( document ).ready(function(){$('.toc-h1').waitUntilExists(" +
                "function(){$('.toc-h1').hide(); " +
                "$('.toc-h2').hide()}, " +
                "false, true);});" +
            "</script>" +
            '<a href="https://github.com/saltukalakus/etk"><img style="position: fixed; top: 0; left: 0; border: 0; z-index: 999999" src="https://camo.githubusercontent.com/121cd7cbdc3e4855075ea8b558508b91ac463ac2/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f677265656e5f3030373230302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_green_007200.png"></a>' +
            "</body>\n</html>"))
        .pipe(replace("Global", "API"))
        .pipe(gulp.dest('out'));
});

// Copy addition files for project site
gulp.task('patch_files_copy', ['patch_api_document'], shell.task([
    'cp ./confs/jsdoc/jquery-watch-element.js ./out/scripts'
]));

// Entry point to generate the docs/API web site.
gulp.task('document', ['patch_files_copy']);

// Deploy web site to GitHub
gulp.task('deploy_site', function() {
    return gulp.src('./out/**/*')
        .pipe(ghPages());
});

gulp.task('publish', shell.task([
        'npm version patch',
        'git commit -m "Update Etk version"',
        'git push',
        'npm publish'
        ])
);

gulp.task('watch', function () {
    gulp.watch('./*.js', ['lint']);
    gulp.watch('./*.js', ['jsbuild']);
});
