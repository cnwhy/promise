var path = require("path");
var gulp = require("gulp");
var util = require("gulp-util");
var mocha = require("gulp-mocha");
var browserify = require("gulp-browserify");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

var package = require("./package.json");

gulp.task('build',['test'],function(){
	return gulp.src('./browser-source.js')
		.pipe(browserify())
		.pipe(rename({
			basename:package.name
		}))
		.pipe(gulp.dest('./dist'))
		.pipe(uglify())
		.pipe(rename({
			basename:package.name+".min"
		}))
		.pipe(gulp.dest('./dist'));
})

gulp.task('test',function(){
	return gulp.src('test/index.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
});

gulp.task('default', ['build']);


