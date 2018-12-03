const path = require("path");

module.exports = {
	mode: "production",
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
		filename: "index.js"
	}
};
