const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const del = require("del");
const gulp = require("gulp");
const htmlbeautify = require("gulp-html-beautify");
const pug = require("gulp-pug");

var cssPlugins = ["./src/css/jquery.fancybox.min.css", "./src/css/slick.css"];

var cssFiles = [
  "./src/css/plugins.css",
  "./src/css/styles.css",
  "./src/css/styles-mobile.css",
  "./src/css/styles-tablet.css",
  "./src/css/styles-desktop.css"
];

function cssPlugin() {
  return gulp
    .src(cssPlugins)
    .pipe(concat("plugins.css"))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest("./src/css"));
}

function cssMain() {
  return gulp
    .src(cssFiles)
    .pipe(concat("styles.css"))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions", "IE 10"],
        cascade: false
      })
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
}

function cssFiltersPrefix() {
  return gulp
    .src("./src/css/filters.css")
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions", "IE 10"],
        cascade: false
      })
    )
    .pipe(cleanCSS({ level: 2 }));
}

function cssFilters() {
  return gulp
    .src(["./src/css/nouislider.min.css", "./src/css/filters.css"])
    .pipe(concat("filters.css"))
    .pipe(gulp.dest("./build/css"));
}

function cssCabinet() {
  return gulp
    .src("./src/css/cabinet.css")
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions", "IE 10"],
        cascade: false
      })
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
}

function cssProductCard() {
  return gulp
    .src("./src/css/product-card.css")
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions", "IE 10"],
        cascade: false
      })
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest("./build/css"));
}

function cssClean() {
  return del(["./build/css/*"]);
}

function cssCleanCabinet() {
  return del(["./build/css/cabinet.css"]);
}

function htmlBuild() {
  return gulp
    .src("./src/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("./src"))
    .pipe(browserSync.stream());
}

function htmlPretty() {
  var options = {
    indentSize: 2
  };
  return gulp
    .src("./src/*.html")
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest("./build"));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch("./src/**/*.css", gulp.series("css-build"));
  gulp.watch("./src/*.pug", gulp.series("html-build"));
}

function watchCheckout() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch(
    "./src/css/cabinet.css",
    gulp.series("css-clean-cabinet", "css-cabinet")
  );
  gulp.watch("./src/checkout*.pug", gulp.series("html-build"));
}

gulp.task("pug-to-html", htmlBuild);
gulp.task("htmlbeautifer", htmlPretty);
gulp.task("html-build", gulp.series("pug-to-html", "htmlbeautifer"));

gulp.task("css-plugins", cssPlugin);
gulp.task("css-filters-prefix", cssFiltersPrefix);
gulp.task("css-clean", cssClean);
gulp.task("css-main", cssMain);
gulp.task("css-filters", cssFilters);
gulp.task("css-cabinet", cssCabinet);
gulp.task("css-clean-cabinet", cssCleanCabinet);
gulp.task("css-product-card", cssProductCard);
gulp.task(
  "css-all",
  gulp.parallel("css-main", "css-filters", "css-cabinet", "css-product-card")
);
gulp.task("css-build", gulp.series("css-clean", "css-all"));

gulp.task("watch-checkout", watchCheckout);
gulp.task("watch", watch);
gulp.task("build-pc", gulp.parallel("html-build", "css-product-card"));
gulp.task("build-cab", gulp.parallel("html-build", "css-cabinet"));
gulp.task("build", gulp.parallel("html-build", "css-build"));
gulp.task("dev", gulp.series("build", "watch"));
