var gulp        = require('gulp');
var gulp_config = require('../gulp-config');

var opts        = gulp_config.pluginOptions;
var src         = gulp_config.paths.sources;
var dest        = gulp_config.paths.destinations;

var tsc     = require('gulp-typescript');
var merge   = require('merge2');

var tsProject = tsc.createProject(opts.typescript);

// Compile everything
var compile = function()
{
	var tsResult = gulp.src(src.typescript).pipe(tsc(tsProject));

	return merge([
		tsResult.dts.pipe(gulp.dest(dest.ts)),
        tsResult.js.pipe(gulp.dest(dest.ts))
    ]);
}

// Incremental compilation
var watch = function()
{
    // typescript:compile is incremental
    gulp.watch(src.typescript, ['typescript:compile']);
};

module.exports = {
  compile: compile,
  watch: watch
};
