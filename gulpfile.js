const gulp = require("gulp");

const webpack = require("webpack-stream");

const gulpCopy = require("gulp-copy");

const path = require("path");

gulp.task("build", function() {
	return gulp
		.src("index.ts")
		.pipe(webpack(require("./webpack.config")))
		.pipe(gulp.dest("dist"))
		.pipe(
			gulpCopy(path.resolve("../../server-files/client_packages/nativeui"), {
				prefix: 1
			})
		);
});
