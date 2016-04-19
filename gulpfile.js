// Include gulp
var gulp        = require('gulp-help')(require('gulp'));

// Include build-tasks
var server      = require('./build-tasks/server');
var typescript  = require('./build-tasks/typescript');
var statics     = require('./build-tasks/statics');
var browserify  = require('./build-tasks/browserify');
var clean       = require('./build-tasks/clean');
var node        = require('./build-tasks/node');
var test        = require('./build-tasks/test');

// Sub-tasks
gulp.task('server:reload', "Reload the attached browsers", server.reload);
gulp.task('server:serve', false, ['compile'], server.serve);

gulp.task('statics:compile', "Compile statics (html, css) sources", statics.compile);
gulp.task('statics:watch', false, statics.watch);

gulp.task('typescript:compile', "Compile typescript sources", typescript.compile);
gulp.task('typescript:watch', false, typescript.watch);

gulp.task('browserify:bundle', false, browserify.bundle);
gulp.task('browserify:compile', "Bundle js sources", ['typescript:compile'], browserify.compile);
gulp.task('browserify:watch', ['typescript:watch'], browserify.watch);

gulp.task('node:rerun', false, node.run);
gulp.task('node:run', "Run cli", ['typescript:compile'], node.run);
gulp.task('node:watch', ['typescript:watch'], node.watch);

gulp.task('test:local', ['browserify:compile'], test.local);
gulp.task('test:browser', ['browserify:compile'], test.browser);

// Accumulative tasks
gulp.task('compile', "Compile everything", [
    'statics:compile',
    'typescript:compile',
    'browserify:compile'
]);

gulp.task('watch', false, [
    'statics:watch',
    'typescript:watch',
    'browserify:watch'
]);

gulp.task('clean', "Cleans up the build environment", clean.clean);

gulp.task('serve', "Compile and serve the project", ['server:serve']);

gulp.task('browser', "Serve project watching for changes", ['serve', 'watch']);

gulp.task('desktop', "Run cli and watch for changes", ['node:run', 'node:watch']);

gulp.task('default', ["browser"]);

gulp.task('test', ["test:local", "test:browser"]);
