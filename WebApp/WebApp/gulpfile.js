﻿/// <binding BeforeBuild='default' />
var gulp = require("gulp"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    del = require("del"),
    less = require("gulp-less"),
    path = require("path"),
    debug = require("gulp-debug");

var config = {
    appSrc: ["app/**/*.js", "!app/**/*.min.js"],
    vendorScriptsSrcWithOrder: [
        "scripts/jquery-3.1.0.js",
        "scripts/angular.js",
        "scripts/angular-animate.js",
        "scripts/angular-route.js",
        "scripts/angular-sanitize.js",
        "scripts/bootstrap.js",
        "scripts/toastr.js",
        "scripts/moment.js",
        "scripts/ui-bootstrap-tpls-0.10.0.js",
        "scripts/spin.js"]
}

//delete the output file(s)
gulp.task("clean", function () {
    return del(["app/out/all.min.js", "app/out/vendorScripts.min.js"]);
});

gulp.task("appScripts", ["clean"], function () {
    return gulp.src(config.appSrc)
      .pipe(uglify())
      .pipe(concat("appScripts.min.js"))
      .pipe(gulp.dest("app/out"));
});

gulp.task("vendorScripts", ["clean"], function () {
    return gulp.src(config.vendorScriptsSrcWithOrder)
      .pipe(uglify())
      .pipe(concat("vendorScripts.min.js"))
      .pipe(gulp.dest("app/out"));
});

gulp.task("default", ["vendorScripts", "appScripts", "compileOwnLess", "concatVendorCss", "concatOwnCss"], function () { });

gulp.task("compileOwnLess", function () {
    return gulp.src("Content/styles/own/**/*.less")
      .pipe(less({
          paths: [path.join(__dirname, "less", "includes")]
      }))
      .pipe(gulp.dest("app/out/css"));
});

gulp.task("concatVendorCss", function () {
    return gulp.src("Content/styles/vendors/*.css")
      .pipe(concat("vendor-bundle.css"))
      .pipe(gulp.dest("app/out"));
});

gulp.task("concatOwnCss", function () {
    return gulp.src("app/out/css/*.css")
      .pipe(concat("own-bundle.css"))
      .pipe(gulp.dest("app/out"));
});

gulp.task("watch", function () {
    return gulp.watch(config.appSrc, ["appScripts"]);
});