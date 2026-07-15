const gulp = require('gulp');

const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

const jsdocConfig = require('./jsdoc.json');

const settings = {
  PATH_DOCS: './docs',
  PATH_BUILD: './dist'
};

function clean() {
  return $.del([
    settings.PATH_DOCS,
    settings.PATH_BUILD
  ]);
}

function copyScopedBootstrap() {
  return gulp.src('src/scoped-bootstrap/*.css')
  .pipe(gulp.dest(settings.PATH_BUILD));
}

function copyDocsAssets() {
  return gulp.src('src/docs-assets/**/*.*')
  .pipe(gulp.dest(settings.PATH_DOCS));
}

const docsAssets = gulp.parallel(
  copyDocsAssets,
  copyScopedBootstrap
);

function docs() {
  return gulp.src('something-ignored.source', { allowEmpty: true })
  .pipe($.jsdoc3(jsdocConfig));
}

const docsTask = gulp.series(
  clean,
  docsAssets,
  docs
);

function buildJs() {
  return gulp.src('src/ttbSdk.js')
  .pipe(gulp.dest(settings.PATH_BUILD))
  .pipe($.uglify())
  .pipe($.rename('ttbSdk.min.js'))
  .pipe(gulp.dest(settings.PATH_BUILD));
}

function buildCss() {
  return gulp.src('src/ttbSdk.css')
  .pipe(gulp.dest(settings.PATH_BUILD))
  .pipe($.csso())
  .pipe($.rename('ttbSdk.min.css'))
  .pipe(gulp.dest(settings.PATH_BUILD));
}

const build = gulp.series(
  clean,
  gulp.parallel(buildJs, buildCss)
);

function watchFiles() {
  gulp.watch(
    ['jsdoc.json', 'src/**/*.*'],
    gulp.series(docsTask, build)
  );
}

exports.clean = clean;
exports.docs = docsTask;
exports.build = build;
exports.watch = gulp.series(
  docsTask,
  build,
  watchFiles
);

exports.default = exports.watch;