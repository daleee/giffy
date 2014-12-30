'use strict';

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');


gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './public'
        },
        files: [
            './public/index.html',
            './public/views/*.html',
            './public/style/*.css',
            './public/js/**/*.js'
        ]
    });
});

gulp.task('build', function () {
    return gulp.src('./public/views/index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('./public/'));
});

gulp.task('dev', ['browser-sync']);
gulp.task('default', ['build']);