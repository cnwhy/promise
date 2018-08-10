var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var clean = require("gulp-clean");
var header = require("gulp-header");
var mocha = require("gulp-mocha");

var rollup = require("rollup");
var commonjs = require("rollup-plugin-commonjs");
var resolve = require("rollup-plugin-node-resolve");

var package = require("./package.json");

var NAME = "Promise";
var banner =
	'/*!\n' +
	' * ' + package.name + ' v' + package.version + '\n' +
	' * Homepage ' + package.homepage + '\n' +
	' * License ' + package.license + '\n' +
	' */\n';
var outputDir = 'dist/'

function runRollup(input, output, format, name) {
	var inputopt = {
		plugins: [
			resolve(),
			commonjs()
		]
	}
	var outputopt = {
		format: format ? format :'umd',
		name: name ? name : NAME,
		banner: banner,
		sourcemap: false
	}
	return rollup.rollup(Object.assign({}, inputopt, {
		input: input
	})).then(function (bundle) {
		return bundle.write(Object.assign({}, outputopt, {
			file: output,
		}))
	})
}

gulp.task('clear:outdir', function(){
	return gulp.src(outputDir,{read: false})
		.pipe(clean());
})

gulp.task('rollup', ['test','clear:outdir'], function () {
	return Promise.all([
		runRollup('./setTimeout', outputDir + 'easy-promise.js'),
	])
})

gulp.task('min',['rollup'],function () {
	return gulp.src([outputDir+'!(*.min).js'])
	.pipe(uglify())
	.pipe(header(banner))
	.pipe(rename({
		suffix:".min"
	}))
	.pipe(gulp.dest(outputDir));
})

gulp.task('build',['rollup','min'], function () {

})

gulp.task('test',function(){
	return gulp.src('test/index.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
});

gulp.task('default', ['test','build']);