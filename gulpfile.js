// Include gulp
var gulp        = require('gulp-help')(require('gulp'));

// Include build-tasks
var typescript  = require('./build-tasks/typescript');
var clean       = require('./build-tasks/clean');

// Sub-tasks
gulp.task('typescript:compile', "Compile typescript sources", typescript.compile);

// Accumulative tasks
gulp.task('compile', "Compile everything", [
    'typescript:compile'
]);

gulp.task('clean', "Cleans up the build environment", clean.clean);

gulp.task('lib', "Prepare for library release!", ['typescript:compile']);

gulp.task('default', ["lib"]);
