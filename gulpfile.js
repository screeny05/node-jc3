var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');
var Cache = require('gulp-file-cache');

var MAIN_SCRIPT = 'dist/index.js';
var SOURCE_JS = 'src/**/*.js';
var CACHE = new Cache();

gulp.task('watch', function(){
    return nodemon({
        script: MAIN_SCRIPT,
        ext: 'js',
        env: {
            NODE_ENV: 'development'
        },
        tasks: ['build']
    });
});

gulp.task('build:js', function(){
    return gulp.src(SOURCE_JS)
        .pipe(CACHE.filter())
        .pipe(babel())
        .pipe(CACHE.cache())
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build:js']);

gulp.task('default', ['build', 'watch']);
