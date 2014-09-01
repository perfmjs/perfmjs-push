/**
 * gulp构建脚本
 * Created by Administrator on 2014/8/26.
 */
var gulp      = require('gulp');
var gutil     = require('gulp-util');
var uglify    = require('gulp-uglify');
var concat    = require('gulp-concat');
var jshint    = require('gulp-jshint');
var del        = require('del');
//var jsdoc   = require('gulp-jsdoc');

var paths = {
    "push.client": "pushclient",
    scripts: [
        './lib/push/client/socket.io.js',
        './lib/push/client/push-client.js'
    ]
};

gulp.task('clean', function(cb) {
    del(['./build'], cb);
});
gulp.task('concat', ['clean'], function () {
    gulp.src(paths.scripts)
        .pipe(concat(paths['push.client'] + '.js'))
        .pipe(gulp.dest('build'))
        .pipe(uglify())
        .pipe(concat(paths['push.client'] + '.min.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['concat']);