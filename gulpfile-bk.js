'use strict';

var gulp = require('gulp');
var gulp2 = interopRequireDefault(gulp);
var gulpLoadPlugins = require('gulp-load-plugins');
var gulpLoadPlugins2 = interopRequireDefault(gulpLoadPlugins);
var browserSync = require('browser-sync');
var browserSync2 = interopRequireDefault(browserSync);
var del = require('del');
var del2 = interopRequireDefault(del);
function interopRequireDefault(obj) {
	return obj && obj.esModule ? obj : {
		default: obj
	};
}

var $ = (0, gulpLoadPlugins2.default)();
var reload = browserSync2.default.reload;

// To compile Sass files
gulp2.default.task('styles', function () {
	return gulp2.default.src('sass/*.scss').pipe($.plumber()).pipe($.sourcemaps.init()).pipe($.sass.sync({
		outputStyle: 'expanded',
		precision: 10,
		includePaths: ['.']
	}).on('error', $.sass.logError)).pipe($.autoprefixer({
		browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
	})).pipe($.sourcemaps.write()).pipe(gulp2.default.dest('css')).pipe($.cssnano()).pipe($.rename({ // rename file
		suffix: ".min" // add *.min suffix
	})).pipe(gulp2.default.dest('css')).on('end', reload);
});

// To minify scripts
gulp2.default.task('scripts', function () {
	return gulp2.default.src(['js/*.js', '!js/*.min.js']).pipe($.plumber()).pipe($.uglify({
		preserveComments: 'license'
	})).pipe($.rename({
		suffix: ".min"
	})).pipe(gulp2.default.dest('js')).on('end', reload);
});

function lint(files, options) {
	return function () {
		return gulp2.default.src(files).pipe(reload({
			stream: true,
			once: true
		})).pipe($.eslint(options)).pipe($.eslint.format()).pipe($.if(!browserSync2.default.active, $.eslint.failAfterError()));
	};
}

gulp2.default.task('lint', lint('js/*.js'));

// Uncomment following if you want to minify HTML files
/*
gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('minified-html'));
});
*/

// Task to minify images
gulp2.default.task('images', function () {
	return gulp2.default.src('img/**/*').pipe($.cache($.imagemin({
		progressive: true,
		interlaced: true,
		// don't remove IDs from SVGs, they are often used
		// as hooks for embedding and styling
		svgoPlugins: [{
			cleanupIDs: false
		}]
	}))).pipe(gulp2.default.dest('images-min'));
});

// Task to serve everything with browserSync (except images)
gulp2.default.task('serve', ['styles', 'scripts'], function () {
	(0, browserSync2.default)({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['./']
		}
	});

	gulp2.default.watch(['*.html', 'images/**/*', 'fonts/**/*']).on('change', reload);

	gulp2.default.watch('sass/**/*.scss', ['styles']);
	gulp2.default.watch('js/**/*.js', ['scripts']);
});

gulp2.default.task('default', function () {
	gulp2.default.start('serve');
});