'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('build', function () {
    //TODO: jshint
    //TODO: Ulgify
    //TODO: Concat.
});

gulp.task('dev', ['browser-sync'], function () {
    console.log('Dev mode active!');
});

gulp.task('default', ['build'], function () {
    console.log('Build complete!');
});