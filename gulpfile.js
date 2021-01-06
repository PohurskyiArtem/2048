var { src, dest, watch, task, parallel} = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var minify = require("gulp-babel-minify");
var image = require('gulp-image');

function css_style() {
    src('./scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./src/css/'));
}

function js_script(){
    src('./scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('index.js'))
        .pipe(minify({
            mangle: {
              keepClassName: true
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./src/js/'));
}

function optimizeImg () {
    src('./images/**/*')
    .pipe(image())
    .pipe(dest('./src/img/'));
}

function watchFiles(){
    watch('./scss/**/*', watchStyles);
    watch('./scripts/**/*', watchScripts);
    watch('./images/**/*', watchImages);
    watch('./**/*.html', browserReload);
    watch('./**/*.php', browserReload);
    browserSync.stream()
}

function sync (done) {
    css_style();
    js_script();
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    })
    done();
}

function browserReload(done){
    browserSync.reload();
    done();
}

function watchStyles(done) {
    css_style();
    browserSync.reload();
    done()
}

function watchScripts(done) {
    js_script();
    browserSync.reload();
    done()
}

function watchImages(done){
    optimizeImg();
    browserSync.reload();
    done()
}

task('default', parallel(sync, watchFiles));
// gulp.task(css_style);
// exports.default = defaultSomeTask;