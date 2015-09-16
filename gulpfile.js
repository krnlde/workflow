"use strict"

const args = require('yargs').argv
const gulp = require('gulp')
const sequence = require('run-sequence')
const del = require('del')
const $ = require('gulp-load-plugins')({lazy: true})
const wiredep = require('wiredep').stream
require('sugar')

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing)
gulp.task('default', ['serve', 'watch'])


gulp.task('serve', ['start-server'], () => {
    return gulp.src(__filename)
    .pipe($.open({
      uri: 'http://localhost:3000'
    }))
})

gulp.task('start-server', ['jade2html'], () => {
  return $.connect.server({
    root: ['.tmp', 'libs'],
    port: 3000,
    livereload: true
  })
})

gulp.task('jade2html', ['styles'], () => {
  return gulp.src(['src/**/*.jade', '!src/template/**', '!src//**/_*.jade'])
    .pipe($.plumber({errorHandler: $.notify.onError({title: 'Jade Compiler', message: '<%= error.message %>'})})) // Important for not breaking the pipe
    .pipe($.debug())
    //.pipe($.cached('jade2html'))
    .pipe($.data((currentFile) => require('./framework') ))
    .pipe($.jade({
      //debug: true,
      pretty: true
    }))
    .pipe(wiredep({
      ignorePath: '../libs'
    }))
    .pipe($.inject(gulp.src(['.tmp/assets/js/**/*.js', '.tmp/assets/css/**/*.css'], {read: false}), {
      ignorePath: '.tmp/'
    }))
    .pipe(gulp.dest('.tmp/'))
    .pipe($.connect.reload())
})

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('styles', () => {
  return gulp.src('src/assets/less/index.less')
    .pipe($.plumber({errorHandler: $.notify.onError({title: 'Less Compiler', message: '<%= error.message %>'})})) // Important for not breaking the pipe
    .pipe($.debug())
    .pipe($.sourcemaps.init())
    .pipe($.less())
    //.pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/assets/css'))
})


gulp.task('liveReload', () => {
  return gulp.src('.tmp/*.html')
    .pipe($.connect.reload())
})

gulp.task('styles-watcher', (done) => {
  sequence('styles', 'liveReload', done)
})

gulp.task('watch', () => {
  gulp.watch(['src/assets/less/**/*.less'], ['styles-watcher'])
  gulp.watch(['src/**/*.jade'], ['jade2html'])
})

// TODO
/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
/*
gulp.task('bump', () => {
  const msg = 'Bumping versions'
  const type = args.type
  const version = args.ver
  const options = {}
  if (version) {
    options.version = version
    msg += ' to ' + version
  } else {
    options.type = type
    msg += ' for a ' + type
  }
  log(msg)

  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root))
})
*/

module.exports = gulp
