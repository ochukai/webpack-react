//var gulp = require('gulp');
//var sass = require('gulp-sass');
//var mincss = require('gulp-mini-css');
//var sourcemaps = require('gulp-sourcemaps');
//var uglify = require('gulp-uglify');
//
//var paths = {
//    dist: {
//        css: './dist/css',
//        js: './dist/js'
//    },
//    src: {
//        css: './src/sass',
//        js: './src/js'
//    }
//};
//
//gulp.task('sass', function () {
//    gulp.src(paths.src.css + '/**/*.scss')
//        .pipe(sourcemaps.init())
//        .pipe(sass())
//        .pipe(mincss())
//        .pipe(sourcemaps.write('/'))
//        .pipe(gulp.dest(paths.dist.css));
//});

/* ------------------------------------------- */

var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");


// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function () {
    gulp.watch(["src/**/*"], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }})
    );

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack:build", err);
        }

        gutil.log("[webpack:build]", stats.toString({ colors: true }));
        callback();
    });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function (callback) {
    // run webpack
    devCompiler.run(function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack:build-dev", err);
        }

        gutil.log("[webpack:build-dev]", stats.toString({ colors: true }));
        callback();
    });
});

gulp.task("webpack-dev-server", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
            publicPath: "/" + myConfig.output.publicPath,
            stats: {
                colors: true
            }
        })
        .listen(8080, "localhost", function (err) {
            if (err) {
                throw new gutil.PluginError("webpack-dev-server", err);
            }

            gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
        });
});

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);
