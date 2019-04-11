'use strict';

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const browserSync = require('browser-sync');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const reload = browserSync.reload;

// const purgecss = require('gulp-purgecss');
// const uglify = require('gulp-uglify');
// const order = require("gulp-order");
// const concat = require("gulp-concat");
// const concat = require('gulp-concat');
// const sass = require('gulp-sass');
// const gzip = require('gulp-gzip');
// const autoprefixer = require('autoprefixer');
// const rename = require('gulp-rename');
// const plumber = require('gulp-plumber');

// Delete the previous build before dry run.
gulp.task('clean-build', () => {
	del.sync(['build/**'])
});

// To compile Sass files
gulp.task('sass-styles', () => {
	gulp.src(['assets/sass/*.scss'])
		.pipe($.plumber())
		// .pipe($.order([
		// 	"assets/sass/scss-essentials/**/*.scss",
		// 	"assets/sass/scss-plugins/**/*.scss",
		// 	"assets/sass/**/*.scss",
		// ]))
		.pipe($.sass.sync({ outputStyle: 'expanded'}).on('error', $.sass.logError))
		.pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
		// .pipe(cleanCSS())
		// .pipe($.purgecss({ content: ["assets/html/index.html"] }))
		// .pipe($.uncss({ html: ['assets/html/index.html'] }))
		.pipe($.concat('all-scss-files.css'))
		.pipe(gulp.dest('build/css'))
		// .pipe($.notify({ message: 'sass-styles task complete' }))
		.on('end', reload);
});

// To compile CSS files
// gulp.task('css-styles', () => {
// 	gulp.src(['assets/css/**/*.css', '!assets/css/**/*.min.css'])
// 		.pipe($.plumber())
// 		.pipe($.order([
// 			"css-essentials/**/*.css",
// 			"css-plugins/**/*.css"
// 		]))
// 		.pipe(cleanCSS())
// 		.pipe($.concat('all-css-plugins.css'))
// 		.pipe(gulp.dest('build/css'))
		// .pipe($.notify({ message: 'css-styles task complete' }))
// 		.on('end', reload);
// });

// Concat All Css files to create one file.
// gulp.task('concat-styles', () => {
// 	gulp.src(['assets/css/css-plugins/**/*.css', 'assets/css/all-scss-files.css'])
// 		.pipe($.plumber())
// 		.pipe(cleanCSS())
// 		.pipe($.concat('all-fileszzzzzzzz.css'))
// 		.pipe(gulp.dest('build/css'))
// });

// To minify javascript. Don't change the order here.
gulp.task('javascript', () => {
	gulp.src(['assets/js/**/*.js', '!assets/js/**/*.min.js'])
		.pipe($.plumber())
		.pipe($.order([
			"js-essentials/**/*.js",
			"js-plugins/**/*.js"
		]))
		.pipe($.uglify({mangle: false}))
		.pipe($.concat('js-plugins.js', { newLine: '\n;' }))
		.pipe(gulp.dest('build/js'))
		// .pipe($.notify({ message: 'javascript task complete' }))
		.on('end', reload);
});

// To minify HTML files.
gulp.task('html-minify', () => {
	gulp.src('*.html')
		.pipe($.htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('build'))
		// .pipe($.notify({ message: 'html-minify task complete' }));
});

// Task to minify images
gulp.task('images-optimise', () => {
	gulp.src('assets/images/**/*')
		.pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('build/images'))
		// .pipe($.notify({ message: 'images-optimise task complete' }));
});

gulp.task('browser-sync', function() {
	browserSync({
		watch: true,
		notify: false,
		port: 9000,
		server: {
			// baseDir: ['./'],
			// index: ['./assets/html/index.html'],
			startPath: ['./assets/html/index.html'],
			directory: true
		},
		// callbacks: {
		// 	ready: function(err, bs) {
		// 		bs.addMiddleware("*", function (req, res) {
		// 			res.writeHead(302, {
		// 				location: "404.html"
		// 			});
		// 			res.end("Redirecting!");
		// 		});
		// 	}
		// }
	});
});

gulp.task('watch', ['clean-build', 'sass-styles', 'javascript', 'browser-sync', 'images-optimise'], () => {
	gulp.watch('assets/sass/**/*.scss', ['sass-styles']);
	gulp.watch('assets/js/**/*.js', ['javascript']);
	gulp.watch('assets/html/**/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);