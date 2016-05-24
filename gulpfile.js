// Include gulp
var gulp        = require('gulp-help')(require('gulp'));

// Include build-tasks
var typescript  = require('./build-tasks/typescript');
var clean       = require('./build-tasks/clean');
var node        = require('./build-tasks/node');

// Sub-tasks
gulp.task('typescript:compile', "Compile typescript sources", typescript.compile);
gulp.task('typescript:watch', false, typescript.watch);

gulp.task('node:rerun', false, node.run);
gulp.task('node:run', "Run cli", ['typescript:compile'], node.run);
gulp.task('node:watch', ['typescript:watch'], node.watch);

// Accumulative tasks
gulp.task('compile', "Compile everything", [
    'typescript:compile'
]);

gulp.task('watch', false, [
    'typescript:watch'
]);

gulp.task('clean', "Cleans up the build environment", clean.clean);

gulp.task('build', "Compile and watch for changes", ['compile', 'watch']);

gulp.task('desktop', "Run cli and watch for changes", ['node:run']);
