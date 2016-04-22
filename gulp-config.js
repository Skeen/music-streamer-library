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
      },
      // Enable to syncronize browser input
      ghostMode: false
    },
    browserify: {
        debug: true
    },
    typescript: {
        noImplicitAny: true,
        declaration: true,
        noExternalResolve: false,
        moduleResolution: "node",
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        removeComments: false,
        module: "commonjs",
        moduleResolution: "node"
    }
  },
  paths: {
    base: output,
    sources: {
      statics: 'src/statics/*.{html,js,css}',
      typescript: ['src/ts/*.ts', 'typings/main.d.ts'],
      browserify: ts_tmp + 'chord-dht.js',
      desktop: ts_tmp + 'main.js'
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
