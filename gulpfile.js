'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var reloadStream = reload.bind(browserSync, { stream: true });

var opts = {
	scripts: 'src/**/*.js',
	distFilename: 'angular-hammer'
};

function filename(name, extList) {
	if (!extList) {
		extList = [];
	} else if (typeof extList === 'string') {
		extList = [extList];
	}
	return [name].concat(extList).join('.');
}

gulp.task('build', function () {
	return gulp.src(opts.scripts)
		.pipe(concat(filename(opts.distFilename, 'js')))
		.pipe(gulp.dest('dist'))
		.pipe(reloadStream());
});

gulp.task('build-minified', function () {
	return gulp.src(opts.scripts)
		.pipe(sourcemaps.init())
		.pipe(concat(filename(opts.distFilename, ['min', 'js'])))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist'))
		.pipe(reloadStream());
});

gulp.task('dist', ['build', 'build-minified']);

gulp.task('watch', function () {
	return gulp.watch(opts.scripts, ['dist']);
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: '.',
      directory: true
    },
    open: false
  });
  gulp.watch([opts.scripts], ['dist']);
});

gulp.task('test-server', function() {
  connect.server({
  	port: 8085
  });
});

gulp.task('test', function () {
  console.log('');
  console.log('To run tests write `npm test`.');
  console.log('');
});
