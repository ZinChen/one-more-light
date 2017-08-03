"use strict";

var gulp = require('gulp');
var prettify = require('gulp-html-prettify');
var cssbeautify = require('gulp-cssbeautify');
var del = require('del');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var plumberNotifier = require('gulp-plumber-notifier');

gulp.task('sass', function () {
  del('build/*.css');
  return gulp.src('./src/*.scss')
    .pipe(plumber())
    .pipe(plumberNotifier())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(gulp.dest('./build/'));
});

gulp.task('pug', function buildHTML() {
  del('build/*.html');
  return gulp.src(['src/**/!(_)*.pug'], {base: './src'})
    .pipe(plumber())
    .pipe(plumberNotifier())
    .pipe(pug())
    .pipe(prettify())
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch', ['browser-sync'], function () {
  gulp.watch('src/**/*.scss', ['sass', browserSync.reload]);
  gulp.watch('src/**/*.pug', ['pug', browserSync.reload]);
  gulp.watch('build/**/*.js', browserSync.reload);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        port: 8080
    });
});
