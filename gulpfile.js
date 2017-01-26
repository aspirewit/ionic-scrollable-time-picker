var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');
var sass = require('gulp-sass');
var css2js = require('gulp-css2js');

gulp.task('html2js', function () {
  return gulp.src(['./src/*.html'])
    .pipe(minifyHtml())
    .pipe(ngHtml2Js({
      moduleName: 'ionic-scrollable-time-picker.templates'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('css2js', function () {
  return gulp.src('./src/*.scss')
    .pipe(sass())
    .pipe(css2js())
    .pipe(concat('styles.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('make-bundle', ['del', 'html2js', 'css2js'], function () {
  return gulp.src(['./dist/*', './src/*.js'])
    .pipe(concat('ionic-scrollable-time-picker.bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('del-temp-files', ['make-bundle'], function () {
  del(['./dist/templates.js', './dist/styles.js']);
});

gulp.task('del', function () {
  del(['./dist/*']);
});

gulp.task('build', ['del-temp-files']);
