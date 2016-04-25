var gulp        = require('gulp');
var gulp_config = require('../gulp-config');

var opts        = gulp_config.pluginOptions;
var src         = gulp_config.paths.sources;
var dest        = gulp_config.paths.destinations;

var mocha       = require('gulp-mocha');
var mocha_phantom = require('gulp-mocha-phantomjs');

var test_local = function()
{
    return gulp.src('test/local/*.js', {read: false})
        .pipe(mocha({reporter: 'spec'}));
}

var test_browser = function()
{
    return gulp.src('test/browser/*.html')
        .pipe(mocha_phantom({reporter: 'spec'}));
}

module.exports = {
    local: test_local,
    browser: test_browser
};


