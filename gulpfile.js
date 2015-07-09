'use strict';

(function() {


/**
 * Libs
 **/
  var gulp        = require('gulp');
  var replace     = require('gulp-replace');
  var gutil       = require('gulp-util');
  var less        = require('gulp-less');
  var connect     = require('gulp-connect');
  var open        = require('gulp-open');
  var inject      = require('gulp-inject');
  var bowerFiles  = require('main-bower-files');
  var series      = require('stream-series');
  var clean       = require('gulp-clean');

  var filter      = require('gulp-filter');
  var cssmin      = require('gulp-minify-css');
  var concat      = require('gulp-concat');
  var ngAnnotate  = require('gulp-ng-annotate');
  var uglify      = require('gulp-uglify');

/**
 * Env
 **/
  var env = {
    base:         __dirname + '/www',
    index:        __dirname + '/www/index.html',
    less:         __dirname + '/www/less/style.less',
    lesssources:  __dirname + '/www/less/**/*.less',
    css:          __dirname + '/www/css',
    stylesources: __dirname + '/www/css/**/*.css',
    mainapp:      __dirname + '/www/js/app.js',
    js:           __dirname + '/www/js/**/*.js',
    port: 9000,
    dist:         __dirname + '/dist'
  };
  var bowerOptions = {
    base: __dirname + '/bower_components',
    options: {
      paths: {
        bowerDirectory: 'bower_components',
        bowerrc: '.bowerrc',
        bowerJson: 'bower.json'
      }
    }
  };


/******************************************************************************
*
* CLEAN
*
*******************************************************************************/
  gulp.task('clean', function() {
    return gulp.src(env.dist)
      .pipe(clean());
  });

/******************************************************************************
*
* BUILD
*
*******************************************************************************/
  gulp.task('build', [
    'less',
    'copyFiles',
    'uglify',
    'cssmin'
  ], build);

  function build() {
    var opt = {
      ignorePath: 'dist',
      addRootSlash: false
    };
    return gulp.src(env.index)
     .pipe(replace(/<!-- (.*?):js -->([\S\s]*?)<!-- endinject -->/gmi, '<!-- $1:js -->\n<!-- endinject -->'))
     .pipe(replace(/<!-- (.*?):css -->([\S\s]*?)<!-- endinject -->/gmi, '<!-- $1:css -->\n<!-- endinject -->'))
     .pipe(inject(gulp.src(env.dist + '/min/*.min.css'), opt))
     .pipe(inject(gulp.src(env.dist + '/min/*.min.js'), opt))
     .pipe(gulp.dest(env.dist));
  }


  gulp.task('copyFiles', function () {
    return gulp.src([
        env.base + '/**/*.*',
        '!**/*.{js,css,less}',
        '!' + env.base + '/bower_components/**/*.*'
      ], {base: env.base})
      .pipe(gulp.dest(env.dist));
  });

   gulp.task('uglify', function() {
    var files   = bowerFiles(bowerOptions);
    files.push(env.mainapp);
    files.push(env.js);

    return gulp.src(files)
      .pipe(filter('**/*.js'))
      .pipe(concat('app.min.js'))
      .pipe(ngAnnotate())
      .pipe(uglify({mangle: false}))
      .pipe(gulp.dest(env.dist + '/min'));
  });

  gulp.task('cssmin', function() {
    var files   = bowerFiles(bowerOptions);
    files.push(env.stylesources);
    return gulp.src(files)
      .pipe(filter('**/*.css'))
      .pipe(concat('style.min.css'))
      .pipe(cssmin())
      .pipe(gulp.dest(env.dist + '/min/'));
  });
/******************************************************************************
*
* Unit tests
*
*******************************************************************************/

/******************************************************************************
*
* End to end tests
*
*******************************************************************************/

/******************************************************************************
*
* DEV
*
*******************************************************************************/
  gulp.task('default', ['less', 'inject', 'connect', 'watches'], function() {
    return gutil.log('!=== App running on localhost:'+ env.port +' ===!');
  });

  // less compile
  gulp.task('less', function() {
    return gulp.src(env.less)
              .pipe(less())
              .pipe(gulp.dest(env.css));
  });

  // connect local server
  gulp.task('connect', function() {
    connect.server({
      port: env.port,
      root: 'www',
      livereload: true
    });
    return gulp.src(env.index)
      .pipe(open('', {url: 'http://localhost:' + env.port}));
  });

  // reload app
  gulp.task('reload', function() {
    return gulp.src(env.index)
      .pipe(connect.reload());
  });

  // inject files
  gulp.task('inject', function() {
    var vendor  = gulp.src(bowerFiles(bowerOptions), {read: false});
    var css     = gulp.src(env.stylesources, {read: false});
    var mainapp = gulp.src(env.mainapp);
    var js      = gulp.src([env.js, '!' + env.mainapp]);

    var opt = {
      ignorePath: 'www'
    };
    var bowerOpt = {
      ignorePath: 'www',
      name: 'bower'
    };

    return gulp.src(env.index)
      .pipe(replace(/<!-- (.*?):js -->([\S\s]*?)<!-- endinject -->/gmi, '<!-- $1:js -->\n<!-- endinject -->'))
      .pipe(replace(/<!-- (.*?):css -->([\S\s]*?)<!-- endinject -->/gmi, '<!-- $1:css -->\n<!-- endinject -->'))
      .pipe(inject(vendor, bowerOpt))
      .pipe(inject(css, opt))
      .pipe(inject(series(mainapp, js), opt))
      .pipe(gulp.dest('./www/'));

  });

/**
 * Watches
 **/
  gulp.task('watches', function() {
    gulp.watch(env.lesssources, ['less', 'inject', 'reload']);
    gulp.watch(env.js, ['inject', 'reload']);
  });

})();