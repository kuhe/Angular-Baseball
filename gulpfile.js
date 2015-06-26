/**
 * Gulpfile template based on work by https://github.com/hwillson
 */

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var del = require('del');
var less = require('gulp-less');

gulp.task('default', function() {
    gulp.run('scripts');
    gulp.run('styles');
    gulp.watch('client/js/internal/**/*.js', function() {
        del('client/js/internal/application.js', function() {
            gulp.run('scripts');
        });
    });
    gulp.watch('client/css/internal/**/*.less', function() {
        del('client/css/internal/application.css', function() {
            gulp.run('styles');
        });
    });
});

gulp.task('scripts', function() {
    gulp.src([
        'client/js/internal/utility/primary/*.js',
        'client/js/internal/utility/*.js',
        'client/js/internal/services/*.js',
        'client/js/internal/baseball/**/*.js',
        'client/js/internal/angular/controllers/**/*.js',
        'client/js/internal/angular/application.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('application.concat.js'))
        .pipe(uglify({ mangle: false }))
        .pipe(sourcemaps.write('./sourcemaps'))
        .pipe(gulp.dest('client/js'))
});

gulp.task('styles', function() {
    gulp.src('client/css/internal/application.less')
        .pipe(less())
        .pipe(gulp.dest('client/css/internal'))
});