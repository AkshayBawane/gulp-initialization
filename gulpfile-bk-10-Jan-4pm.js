'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync');
var del = require('del');
var concat = require('gulp-concat');


const $ = gulpLoadPlugins();
const reload = browserSync.reload;




// To compile Sass files
gulp.task('styles', () => {
	return gulp.src('sass/*.scss')
	// return gulp.src(['sass/*.scss', 'css/**/*.css'])
		.pipe($.plumber())
		// .pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
		// .pipe($.sourcemaps.write())
		.pipe(gulp.dest('dist/css'))
		.pipe($.cssnano())
		.pipe($.rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/css'))
		.on('end', reload);
	}
);

// Works completely fine Don't remove it.
// gulp.task('styles', () => {
//   	return gulp.src(['css/**/*.css']) //select all files inside the folder.
//   		.pipe($.plumber())
// 	    .pipe(concat('main-concat.css'))
// 	    .pipe(gulp.dest('dist')) //Uncompressed output
// 	    .pipe($.cssnano())
// 	    .pipe($.rename({ suffix: '.min' }))
// 	    .pipe(gulp.dest('dist')) //Compressed output
// 	    .on('end', reload);
// 	}
// );

// To minify scripts. Don't change the order here.
gulp.task('scripts', () => {
  	return gulp.src(['js/**/*.js']) //select all files inside the folder.
  	// return gulp.src(['./js/main.js', './js/bootstrap/bootstrap.js', './js/bootstrap/popper.min.js', '.js/jQuery/jquery-3.2.1.min.js']) //select selected files from folder
  		.pipe($.plumber())
	    .pipe(concat('main-concat.js'))
	    .pipe(gulp.dest('dist')) //Uncompressed output
		.pipe($.uglify())
	    .pipe($.rename({ suffix: '.min' }))
	    .pipe(gulp.dest('dist')) //Compressed output
	    .on('end', reload);
	}
);

function lint(files, options) {
	return () => {
		return gulp.src(files)
		.pipe(reload({stream: true, once: true}))
		.pipe($.eslint(options))
		.pipe($.eslint.format())
		.pipe($.if(!browserSync.active, $.eslint.failAfterError()));
	};
}

gulp.task('lint', lint('js/*.js'));

// Uncomment following if you want to minify HTML files
/*
gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('minified-html'));
});
*/

// Task to minify images
gulp.task('images', () => {
	return gulp.src('img/**/*')
		.pipe($.cache($.imagemin({
		progressive: true,
		interlaced: true,
		// don't remove IDs from SVGs, they are often used
		// as hooks for embedding and styling
		svgoPlugins: [{cleanupIDs: false}]
		})))
    .pipe(gulp.dest('images-min'));
});

// Task to serve everything with browserSync (except images)
gulp.task('serve', ['styles', 'scripts'], () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
		baseDir: ['./']
		}
	});

	gulp.watch([
		'*.html',
		'images/**/*',
		'fonts/**/*'
	]).on('change', reload);

	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['scripts']);
});

gulp.task('default', () => {
  	gulp.start('serve');
});
