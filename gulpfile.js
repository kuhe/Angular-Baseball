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
    gulp.watch('js/internal/**/*.js', function() {
        del('js/internal/application.js', function() {
            gulp.run('scripts');
        });
    });
    gulp.watch('css/internal/**/*.less', function() {
        del('css/internal/application.css', function() {
            gulp.run('styles');
        });
    });
});

gulp.task('scripts', function() {
    gulp.src([
        'js/internal/utility/primary/*.js',
        'js/internal/utility/*.js',
        'js/internal/baseball/**/*.js',
        'js/internal/angular/controllers/**/*.js',
        'js/internal/angular/application.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('application.js'))
        .pipe(uglify({ mangle: false }))
        .pipe(sourcemaps.write('./sourcemaps'))
        .pipe(gulp.dest('js'))
});

gulp.task('styles', function() {
    gulp.src('css/internal/application.less')
        .pipe(less())
        .pipe(gulp.dest('css/internal'))
});