var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var del = require('del');

gulp.task('default', function() {
    gulp.watch('js/internal/**/*.js', function() {
        del('js/internal/application.js', function() {
            gulp.run('scripts');
        });
    });
});

gulp.task('scripts', function() {
    gulp.src('js/internal/**/*.js')
        .pipe(concat('application.js'))
        .pipe(gulp.dest('js/internal'))
});