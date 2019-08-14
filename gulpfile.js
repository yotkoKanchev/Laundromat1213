"use strict";

let gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	exec = require("gulp-exec"),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass'),
	cp = require("child_process");

gulp.task("css", function () {
	return gulp.src('_assets/scss/**/*.scss')
		.pipe( sass().on('error', sass.logError) )
		.pipe(autoprefixer())
		.pipe(gulp.dest('./docs/css/'))
		.pipe(browserSync.stream({ match: '**/*.css' }))
});

// Jekyll
gulp.task("jekylldev", function () {
	return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit", shell: true });
});

gulp.task("jekyllprod", function () {
	return cp.spawn("bundle", ["exec", "jekyll", "build --baseurl /Laundromat1213"], { stdio: "inherit", shell: true });
});



gulp.task("watch", function () {

	browserSync.init({
		server: {
			baseDir: "./docs/"
		}
	});

	gulp.watch('_assets/scss/**/*.scss', gulp.series('css'));

	gulp.watch(
		[
			"./*.html",
			"./_includes/*.html",
			"./_layouts/*.html",
			"./_posts/**/*.*"
		]
	).on('change', gulp.series('jekylldev', 'css'));

	gulp.watch('docs/**/*.html').on('change', browserSync.reload);
	gulp.watch('docs/**/*.js').on('change', browserSync.reload);

});

gulp.task("deploy", gulp.series('jekyllprod', 'css'));

gulp.task("default", gulp.series('jekylldev', 'css', 'watch'));