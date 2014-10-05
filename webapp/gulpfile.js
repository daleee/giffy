'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

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
    gulp.watch([
        'index.html',
        'views/*.html',
        'style/*.css',
        'js/**/*.js'
    ], reload);
});

gulp.task('default', ['build']);