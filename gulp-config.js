var pkg   = require('./package.json');

var output = 'dist/';

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
      typescript: ['src/*.ts', 'typings/index.d.ts']
    },
    destinations: {
      dist: output
    }
  }
};
