const gulp = require('gulp');
const cssmin = require('gulp-clean-css');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const gp_rename = require('gulp-rename');
const gp_sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('clean', function () {
    return gulp.src('dist/')
        .pipe(clean());
});
gulp.task('minify-css', function () {
    return gulp.src(['src/assets/css/**/*.css'])
        .pipe(cssmin())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/css/'));
});
gulp.task('minify-img', function () {
    return gulp.src('src/assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'))
});

// Gulp task to minify HTML files
gulp.task('pages', function() {
    return gulp.src(['./src/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dist'));
});


gulp.task('scriptsJs', function() {
    return gulp.src('./src/assets/js/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(gp_rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('scripts', function () {
    return runSequence('clean', ['minify-css', 'minify-img', 'pages', 'scriptsJs']);
});

gulp.task('build', ['scripts']);

gulp.task('watch', ['build', 'browser-sync'], function () {
    return gulp.watch(['src/**/*'], ['build', reload]);
});

gulp.task('default', ['watch']);
