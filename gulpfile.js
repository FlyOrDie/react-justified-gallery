'use strict';

const gulp = require('gulp');
const gulplog = require('gulplog');
const gulpUtils = require('gulp-util');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const add = require('gulp-add');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const replaceName = require('gulp-replace-name');
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const fs = require('fs');

const del = require('del');
const browserSync = require('browser-sync').create();

const webpackBasicExampleConfig = require('./.webpack.config')('EXAMPLE:BASIC');
const libName = 'reactJustified.js';
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

/* CONFIGS */

const pathConfig = {
	library: {
		pathToDist: 'dist',
		pathToLib: 'lib',
	},
	examples: {
		basic: {
			pathToDist: 'examples/basic/dist',
			pathToFolder: 'examples/basic',
			pathToStyles: 'examples/basic/styles',
			pathToImages: 'examples/basic/images',
		},
	},
};

const tasksConfig = {
	library: {
		clean: 'lib:clean',
		build: 'lib:build',
		watch: 'lib:watch',
		main: 'lib:main',
	},
	examples: {
		basic: {
			clean: 'examples:basic:clean',
			build: {
				styles: 'examples:basic:build:styles',
				images: 'examples:basic:build:images',
				js: 'examples:basic:build:js',
			},
			buildAll: 'examples:basic:build_all',
			watch: {
				images: 'examples:basic:watch:images',
				styles: 'examples:basic:watch:styles',
				browser: 'examples:basic:watch:browser',
			},
			main: 'examples:basic:main',
		},
	},
};

/* LIBRARY TASKS */

gulp.task(tasksConfig.library.clean, () => del(pathConfig.library.pathToDist));

gulp.task(tasksConfig.library.build, () => {
	return gulp.src(`${pathConfig.library.pathToLib}/*.js`)
		.pipe(plumber({
			errorHandler: notify.onError(err => {
				gulpUtils.log(`[${tasksConfig.library.build}]`, err.toString({ colors: true }));
				return ({
					title: `${tasksConfig.library.build}`,
					message: err.message,
				});
			}),
		}))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: [
				'es2015',
				'react',
			],
			plugins: [
				'transform-class-properties',
				'transform-es2015-destructuring',
				'transform-object-rest-spread',
			],
		}))
		// .pipe(replaceName(/.+\.js/g, libName))
		.pipe(gulp.dest(pathConfig.library.pathToDist))
		// .pipe(uglify())
		// .pipe(replaceName(/\.js/g, '.min.js'))
		// .pipe(sourcemaps.write())
		// .pipe(gulp.dest(pathConfig.library.pathToDist));
});

gulp.task(tasksConfig.library.watch, () => {
	gulp.watch(`${pathConfig.library.pathToLib}/**/*.*`, gulp.series(tasksConfig.library.build));
});

gulp.task(tasksConfig.library.main, gulp.series(
	tasksConfig.library.clean,
	tasksConfig.library.build,
	tasksConfig.library.watch
));

/* EXAMPLES TASKS */
	/* BASIC EXAMPLE TASKS */

gulp.task(tasksConfig.examples.basic.clean, () => del(pathConfig.examples.basic.pathToDist));

gulp.task(tasksConfig.examples.basic.build.styles, () => {
	let normalize;

	try {
		normalize = fs.readFileSync('./node_modules/normalize.css/normalize.css').toString();
	} catch (e) {
		if (e) {
			throw new gulpUtils.PluginError(
				'Normalize.css file was not found. Maybe you forgot to install node-modules?',
				e
			);
		}
	}

	return gulp.src(`${pathConfig.examples.basic.pathToStyles}/**/*.css`,
		{ base: `${pathConfig.examples.basic.pathToFolder}` })
		.pipe(add('normalize.css', normalize, true))
		.pipe(sourcemaps.init())
		.pipe(concat('styles.css'))
		.pipe(sourcemaps.write())
		.pipe(cssnano())
		.pipe(gulp.dest(`${pathConfig.examples.basic.pathToDist}/styles`));
});

gulp.task(tasksConfig.examples.basic.build.images, () => {
	return gulp.src(`${pathConfig.examples.basic.pathToImages}/**/*.{jpeg,jpg,JPEG,JPG,png,PNG,svg,SVG}`,
		{ base: `${pathConfig.examples.basic.pathToFolder}` })
		.pipe(imagemin())
		.pipe(gulp.dest(pathConfig.examples.basic.pathToDist));
});

gulp.task(tasksConfig.examples.basic.build.js, callback => {
	let firstBuildReady = false;

	function done(err, stats) {
		firstBuildReady = true;

		if (err) return;

		gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
			colors: true,
		}));
	}

	return gulp.src(`${pathConfig.examples.basic.pathToFolder}/*.{js,hbs}`)
		.pipe(plumber({
			errorHandler: notify.onError(err => {
				gulpUtils.log(`[${tasksConfig.examples.basic.build.js}]`, err.toString({ colors: true }));
				return ({
					title: tasksConfig.examples.basic.build.js,
					message: err.message,
				});
			}),
		}))
		.pipe(webpackStream(webpackBasicExampleConfig, null, done))
		.pipe(replaceName(/.+\.js$/, 'application.js'))
		.pipe(gulp.dest(pathConfig.examples.basic.pathToDist))
		.on('data', () => {
			if (firstBuildReady) {
				callback();
			}
		});
});

gulp.task(tasksConfig.examples.basic.buildAll, gulp.parallel(
	tasksConfig.examples.basic.build.styles,
	tasksConfig.examples.basic.build.images,
	tasksConfig.examples.basic.build.js
));

gulp.task(tasksConfig.examples.basic.watch.styles, () => {
	gulp.watch(`${pathConfig.examples.basic.pathToStyles}/**/*.css`,
		gulp.series(tasksConfig.examples.basic.build.styles));
});

gulp.task(tasksConfig.examples.basic.watch.images, () => {
	gulp.watch(`${pathConfig.examples.basic.pathToImages}/**/*.css`,
		gulp.series(tasksConfig.examples.basic.build.images));
});

gulp.task(tasksConfig.examples.basic.watch.browser, () => {
	browserSync.init({
		server: pathConfig.examples.basic.pathToDist,
	});

	browserSync.watch(`${pathConfig.examples.basic.pathToDist}/**/*.*`)
		.on('change', browserSync.reload);
});

gulp.task(tasksConfig.examples.basic.main, gulp.series(
	tasksConfig.examples.basic.clean,
	tasksConfig.examples.basic.buildAll,
	gulp.parallel(
		tasksConfig.examples.basic.watch.styles,
		tasksConfig.examples.basic.watch.images,
		tasksConfig.examples.basic.watch.browser
	)
));

