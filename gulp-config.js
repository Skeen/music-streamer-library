var pkg   = require('./package.json');

var output = 'dist/';
var tmp = 'tmp/';
var ts_tmp = tmp + 'ts/';

module.exports = {
  pkg: {
    name: pkg.name
  },
  pluginOptions: {
    browser_sync: {
      port   : 1987,
      server : {
        baseDir: output
      }
    },
    browserify: {
        debug: true
    },
    typescript: {
        noImplicitAny: true,
        declaration: true,
        noExternalResolve: true
    }
  },
  paths: {
    base: output,
    sources: {
      statics: 'src/statics/*.{html,js,css}',
      typescript: 'src/ts/*.ts',
      browserify: ts_tmp + '*.js'
    },
    destinations: {
      dist: output,
      css : output + 'css/',
      html: output,
      js  : output + 'js/',
      tmp : tmp,
      ts  : ts_tmp
    }
  }
};
