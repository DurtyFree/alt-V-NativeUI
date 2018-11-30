const path = require("path");

module.exports = {
	mode: "production",
	entry: "./index.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts"]
	},
	output: {
		filename: "index.js",
		path: path.join(__dirname, "dist")
	}
};
