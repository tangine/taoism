const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass-embedded"));
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const fs = require("fs");

const SOURCE_DIR = "src";
const DEST_DIR = "assets";

function styles() {
  return gulp.src(`${SOURCE_DIR}/css/**/*.scss`)
    .pipe(sass({ style: 'compressed' }, null).on("error", sass.logError))
    // .pipe(uglify())
    .pipe(gulp.dest(DEST_DIR));
}

function getBundleTasks() {
  return fs.readdirSync(`${SOURCE_DIR}/js`, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      const dirName = dirent.name
      const glob = `${SOURCE_DIR}/js/${dirName}/**/*.js`;
      const outputName = `${dirName}.js`;

      return function bundle() {
        return gulp.src(glob).pipe(concat(outputName))
          .pipe(uglify())
          .pipe(gulp.dest(DEST_DIR));
      }
    })
    ;
}

const scripts = gulp.parallel(...getBundleTasks());

function watch() {
  gulp.watch(`${SOURCE_DIR}/css/**/*.scss`, styles);
  gulp.watch(`${SOURCE_DIR}/js/**/*.js`, scripts);
}

const build = gulp.parallel(styles, scripts);

exports.default = gulp.series(build, watch);