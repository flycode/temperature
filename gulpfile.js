var gulp = require('gulp'),
    less = require('gulp-less'),
    //autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    inject = require("gulp-inject"),
    bower = require('main-bower-files'),
    rev = require("gulp-rev");

var target_css = './public/css';
var target_js = './public/js';

var paths = {
  less: './assets/less/main.less',
  css: './assets/css/*.css',
  scripts: './assets/js/**/*.js',
  images: './client/img/**/*',
  public: './public/',
  mainFile: 'layout.html'
};

// 1. Injectar referencias al HTML
gulp.task('inject-html', ['styles', 'scripts', 'clean-tmp'], function() {
  return gulp.src(paths.public+paths.mainFile)
    .pipe(inject(gulp.src([target_css+'/*.css', target_js+'/*.js'], {read:false}), {
      ignorePath: '/public'
    }))
    .pipe(gulp.dest(paths.public));
})

// Estilos (autoprefixer, minify)
gulp.task('styles', ['clean-old-styles','build-css', 'build-less'], function() {
  return gulp.src('./assets/tmp/*.css')
    .pipe(concat('main.css'))
    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'ios 6', 'android 4'))
    .pipe(minifycss())
 // .pipe(rev())
    .pipe(gulp.dest(target_css))
});

// Limpia viejos CSS
gulp.task('clean-old-styles', function() {
  return gulp.src(target_css+'/main-*.css', {read:false})
    .pipe(clean({force: true}));
});

// Concatena CSS
gulp.task('build-css', function() {
  return gulp.src(paths.css)
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./assets/tmp'));
});

// Compila LESS -> CSS
gulp.task('build-less', function() {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(concat('less.css'))
    .pipe(gulp.dest('./assets/tmp'));
});

// Limpiar archivos temporales creados
gulp.task('clean-tmp', function() {
  return gulp.src('./assets/tmp/*', {read:false})
    .pipe(clean({force: true}));
});

// Scripts JS
gulp.task('scripts', ['clean-old-scripts','bower'], function() {
  return gulp.src(paths.scripts)
      .pipe(concat('main.js'))
      // .pipe(uglify())
      // .pipe(rev())
    .pipe(gulp.dest(target_js));
});

// Limpiar viejos JS
gulp.task('clean-old-scripts', function() {
  return gulp.src([target_js+'/main-*.js',target_js+'/lib-*.js',target_js+'/angular-*.js'], {read:false})
    .pipe(clean({force: true}));
});

// Concat & flatten Bower components (JS)
gulp.task('bower', function() {
  return gulp.src(bower())
    .pipe(flatten())
    .pipe(concat('lib.js'))
    // .pipe(uglify())
    // .pipe(rev())
    .pipe(gulp.dest(target_js));
});

// Watch
gulp.task('watch', function() {
  gulp.watch('./assets/less/**/*.less', ['inject-html']);
  gulp.watch('./assets/js/**/*.js', ['inject-html']);
})

// Default (inicia sequencia)
gulp.task('default', ['inject-html', 'watch']);