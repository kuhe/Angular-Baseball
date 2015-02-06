var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var del = require('del');
var less = require('gulp-less');

gulp.task('default', function() {
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
        'js/internal/utility/**/*.js',
        'js/internal/baseball/**/*.js',
        'js/internal/angular/controllers/**/*.js',
        'js/internal/angular/application.js'
    ])
        .pipe(concat('application.js'))
        .pipe(gulp.dest('js/internal'))
});

gulp.task('styles', function() {
    gulp.src('css/internal/application.less')
        .pipe(less())
        .pipe(gulp.dest('css/internal'))
});