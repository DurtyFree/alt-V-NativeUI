const gulp = require("gulp");

const webpack = require("webpack-stream");

gulp.task("build", function() {
	return gulp
		.src("index.ts")
		.pipe(webpack(require("./webpack.config")))
		.pipe(gulp.dest("dist"));
});
