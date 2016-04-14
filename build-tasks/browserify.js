var gulp        = require('gulp');
var gulp_config = require('../gulp-config');

var opts        = gulp_config.pluginOptions;
var src         = gulp_config.paths.sources;
var dest        = gulp_config.paths.destinations;

var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

// add custom browserify options here
var b_opts = assign({}, watchify.args, opts.browserify);
var bundler = watchify(browserify(b_opts).add('./tmp/ts/main.js')); 

// Output build logs to the gulp terminal
bundler.on('log', gutil.log);

function bundle()
{
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist/js'));
}

// Compile everything
// NOTE: Compiling is an alias for bundling
var compile = bundle;

// Incremental compilation
var watch = function()
{
    // Whenever one of the bundle dependencies change, rebundle
    bundler.on('update', function()
    {
        gulp.start('browserify:bundle');
    });
};

module.exports = {
  compile: compile,
  bundle: bundle,
  watch: watch
};
