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

gulp.task('dev', ['browser-sync']);
gulp.task('default', ['build']);