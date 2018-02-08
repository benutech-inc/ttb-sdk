
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

var jsdocConfig = require('./jsdoc.json');

var settings = {
  PATH_DOCS: './docs',
  PATH_BUILD: './dist'
};

gulp.task('del', function () {
  //console.log('task: del');
  return $.del([settings.PATH_DOCS, settings.PATH_BUILD]);
});

gulp.task('copy-docs-assets', ['del'], function () {
  //console.log('task: copy-docs-assets');
  return gulp.src(['src/docs-assets/**/*.*'])
    .pipe(gulp.dest(settings.PATH_DOCS));
});

gulp.task('docs', ['copy-docs-assets'], function () {
  //console.log('task: doc');
  return gulp.src(['something-ignored.source'])
    .pipe($.jsdoc3(jsdocConfig));
});

gulp.task('build', ['del'], function () {
  //console.log('task: build');
  return gulp.src(['src/ttbsdk.js'])
    .pipe(gulp.dest(settings.PATH_BUILD))
    .pipe($.uglify())
    //.on('error', function (err) { console.log(err.toString());})
    .pipe($.rename('ttbsdk.min.js'))
    .pipe(gulp.dest(settings.PATH_BUILD));
});

gulp.task('watch', ['docs', 'build'], function () {
  //console.log('task: watch');
  gulp.watch(['jsdoc.json', 'src/**/*.*'], ['docs', 'build']);
});

gulp.task('doc-dev', ['watch']);
