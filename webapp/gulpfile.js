'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './'
        },
        files: [
            'index.html',
            'views/*.html',
            'style/*.css',
            'js/**/*.js'
        ]
    });
});

gulp.task('build', function () {
    //TODO: jshint
    //TODO: Ulgify
    //TODO: Concat.
});

gulp.task('dev', ['browser-sync']);
gulp.task('default', ['build']);