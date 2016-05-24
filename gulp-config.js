var pkg   = require('./package.json');

var output = 'dist/';
var tmp = 'tmp/';
var ts_tmp = tmp + 'ts/';

module.exports = {
  pkg: {
    name: pkg.name
  },
  pluginOptions: {
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
      typescript: ['src/ts/*.ts', 'typings/main.d.ts'],
      desktop: ts_tmp + 'main.js'
    },
    destinations: {
      dist: output,
      tmp : tmp,
      ts  : ts_tmp
    }
  }
};
