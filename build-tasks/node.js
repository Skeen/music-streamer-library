var gulp        = require('gulp');
var gulp_config = require('../gulp-config');

var opts        = gulp_config.pluginOptions;
var src         = gulp_config.paths.sources;
var dest        = gulp_config.paths.destinations;

var spawn = require('child_process').spawn;
var node;

// Clean up sub-task, if main exit
process.on('exit', function() {
    if (node)
    {
        node.kill()
    }
});

// Run the program
var run = function()
{
    if (node) node.kill();

    node = spawn('node', [src.desktop, "res/"], {stdio: 'inherit'});

    node.on('close', function (code) {
        if (code === 8)
        {
            gulp.log('Error detected, waiting for changes...');
        }
    });
}

// Incremental compilation
var watch = function()
{
    gulp.watch(dest.ts + "/*.js", ['node:rerun']);
};

module.exports = {
    run   : run,
    watch : watch
};


