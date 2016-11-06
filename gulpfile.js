var gulp            = require('gulp'),
    jslint          = require('gulp-jslint'),
    fs              = require('fs'),
    less            = require('gulp-less'),
    autoprefixer    = require('gulp-autoprefixer'),
    sourcemaps      = require('gulp-sourcemaps'),
    cleanCSS        = require('gulp-clean-css'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    compile        = require('gulp-ejs-template'),
    watch           = require('gulp-watch');

var DIST_DIR = 'dist';

gulp.task('lint', function (cb) {
    return gulp.src(['./src/**/*.js'])
        .pipe(jslint({
            node: true,
            stupid: true
        }))
        .pipe(jslint.reporter('default', {}));
    cb();
});

gulp.task('make-dirs', function () {
    if (!fs.existsSync('./dist/logs')){
        return fs.mkdirSync('./dist/logs', function (err) {
            if (err) console.log('Adding directories failed' + err);
        });
    }
});

gulp.task('build-back-end', function () {
    return gulp.src(['./src/back_end/**/**'])
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('compile-html', function () {
    return gulp.src(['./src/front-end/html/*'])
        .pipe(gulp.dest(DIST_DIR + '/public'));
});

gulp.task('compile-js', function () {
    return gulp.src([
        './src/front-end/js/models/**',
        './src/front-end/js/collections/**',
        './src/front-end/js/services/**',
        './src/front-end/js/views/**',
        './src/front-end/js/initialize.js'
    ])
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write())
        .pipe(uglify())
        .pipe(gulp.dest(DIST_DIR + '/public/js'));
});

gulp.task('vendor-js', function () {
    return gulp.src([
        './src/front-end/js/models/**',
        './src/front-end/js/collections/**',
        './src/front-end/js/services/**',
        './src/front-end/js/views/**',
        './src/front-end/js/initialize.js'
    ])
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write())
        .pipe(uglify())
        .pipe(gulp.dest(DIST_DIR + '/public/js'));
});

gulp.task('compile-less', function () {
    return gulp.src([
        './src/front-end/less/main.less'
    ])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_DIR + '/public/css/'));
});

gulp.task('libs', function(){
    return gulp.src([
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/materialize/dist/css/materialize.min.css',
        './bower_components/materialize/dist/js/materialize.min.js',
        './bower_components/leaflet/dist/**/*.*',
        './src/front-end/libs/**/*.*'
    ])
        .pipe(gulp.dest(DIST_DIR + '/public/libs'));
});

gulp.task('fonts', function(){
    return gulp.src([
        './src/front-end/fonts/**/*.*'

    ])
        .pipe(gulp.dest(DIST_DIR + '/public/fonts/'));
});

gulp.task('img', function(){
    return gulp.src('./src/front-end/img/**/*.*')
        .pipe(gulp.dest(DIST_DIR + '/public/img/'));
});

gulp.task('templates', function() {
    return gulp.src('./src/front-end/templates/*.ejs')
        .pipe(compile({
            moduleName: 'templates',
            escape: false
        }))
        .pipe(uglify())
        .pipe(gulp.dest(DIST_DIR + '/public/js'));
});




gulp.task('build', [
    'lint', 
    'make-dirs',
    'vendor-js',
    'libs', 
    'build-back-end', 
    'compile-html', 
    'compile-js',
    'compile-less',
    'fonts',
    'templates',
    'img'
]);

gulp.task('default', ['build']);

gulp.task('watch', function () {
    return gulp.watch('./src/**/**', ['build']);
});