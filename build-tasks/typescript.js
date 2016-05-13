var gulp        = require('gulp');
var gulp_config = require('../gulp-config');

var opts        = gulp_config.pluginOptions;
var src         = gulp_config.paths.sources;
var dest        = gulp_config.paths.destinations;

var tsc     = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var merge   = require('merge2');

var tsProject = tsc.createProject(opts.typescript);

// Compile everything
var compile = function()
{
	var tsResult = gulp.src(src.typescript)
                       .pipe(sourcemaps.init())
                       .pipe(tsc(tsProject));

	return merge([
		tsResult.dts.pipe(gulp.dest(dest.dist)),
        tsResult.js.pipe(sourcemaps.write())
                   .pipe(gulp.dest(dest.dist))
    ]);
}

module.exports = {
  compile: compile
};
