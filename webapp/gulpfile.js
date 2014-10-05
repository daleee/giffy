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
    //TODO: Concat, uglify, etc
});

gulp.task('dev', ['browser-sync'], function () {

});

gulp.task('default', ['build'], function () {

});