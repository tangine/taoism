const { src, dest, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass-embedded"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const fs = require("fs");

const srcDir = "src";
const destDir = "assets";

/**
 * 处理 scss 文件
 */
function styles() {
  return src(`${srcDir}/css/**/*.scss`)
    // noinspection JSCheckFunctionSignatures
    .pipe(sass({ style: "compressed" })
      .on("error", sass.logError))
    .pipe(dest(destDir));
}

/**
 * 为 src/js 下每个子目录生成一个打包任务
 */
function getScriptTasks() {
  return fs
    .readdirSync(`${srcDir}/js`, { withFileTypes: true })
    .filter((child) => child.isDirectory())
    .map((dir) => {
      const dirName = dir.name;
      const glob = `${srcDir}/js/${dirName}/**/*.js`;
      const bundleName = `${dirName}.js`;

      // 返回一个任务函数，而不是 stream
      return function bundle() {
        return src(glob)
          .pipe(concat(bundleName))
          .pipe(uglify())
          .pipe(dest(destDir));
      };
    });
}

/**
 * scripts 是一个组合任务，执行所有子目录打包
 */
const scripts = parallel(...getScriptTasks());

exports.styles = styles;
exports.scripts = scripts;
exports.build = parallel(styles, scripts);

exports.default = function () {
  watch(`${srcDir}/css/**/*.scss`, styles);
  // 监听 js 变化，重新跑所有打包任务
  watch(`${srcDir}/js/**/*.js`, scripts);
};