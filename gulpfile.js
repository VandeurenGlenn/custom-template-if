'use strict';
const {task, series} = require('gulp');
const {rollup} = require('rollup');
const babel = require('rollup-plugin-babel');
const del = require('del');

// used to track the cache for subsequent bundles
let cache;

task('clean', () => {
  return del(['dist']);
});

task('rollup:es6', () => {
  return rollup({
    entry: 'src/custom-template-if.js',
    // Use the previous bundle as starting point.
    cache: cache
  }).then(bundle => {
    // Cache our bundle for later use (optional)
    cache = bundle;

    bundle.write({
      format: 'es',
      plugins: [babel()],
      dest: 'dist/custom-template-if.es6.js'
    });
  });
});

task('rollup:cjs', () => {
  return rollup({
    entry: 'src/custom-template-if.js',
    // Use the previous bundle as starting point.
    cache: cache
  }).then(bundle => {
    // Cache our bundle for later use (optional)
    cache = bundle;

    bundle.write({
      format: 'cjs',
      plugins: [babel()],
      dest: 'dist/custom-template-if.js'
    });
  });
});

task('rollup:browser', () => {
  return rollup({
    entry: 'src/custom-template-if.js',
    // Use the previous bundle as starting point.
    cache: cache
  }).then(bundle => {
    // Cache our bundle for later use (optional)
    cache = bundle;

    bundle.write({
      format: 'iife',
      moduleName: 'CustomTemplateIf',
      plugins: [babel()],
      dest: 'dist/custom-template-if.browser.js'
    });
  });
});

task('rollup', series('rollup:es6', 'rollup:cjs', 'rollup:browser'));
task('build', series('clean', 'rollup'));
task('default', series('build'));
