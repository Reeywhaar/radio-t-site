const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

module.exports = (a, args) => {
	return {
		entry: "./main.js",
		context: path.resolve(__dirname, "front_src"),
		output: {
			path: path.resolve(__dirname, "hugo/static/dist"),
			filename: "[name].js",
			chunkFilename: "[name].component.js",
			publicPath: "/dist",
		},
		mode: args.mode || "production",
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: [
								[
									"@babel/preset-env",
									{
										useBuiltIns: "usage",
										modules: false,
									},
								],
							],
						},
					},
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						"css-loader",
					],
				},
				{
					test: /\.scss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						"css-loader",
						"sass-loader",
					],
				},
				{
					test: /\.svg$/,
					use: {
						loader: "svg-inline-loader",
						options: {
							classPrefix: "icon",
						},
					},
				},
			],
		},
		watchOptions: {
			ignored: /node_modules/,
		},
		plugins: [
			new HtmlWebPackPlugin({
				template: "./webpack-inject.html",
				filename: "../../layouts/partials/webpack-inject.html",
				hash: true,
				inject: false,
			}),
			new MiniCssExtractPlugin({
				filename: "[name].css",
				chunkFilename: "[name].css",
			}),
			new CopyWebpackPlugin([
				{
					from: "./libs",
					to: "./libs",
				},
			]),
			new webpack.DefinePlugin({
				BUILDTIME: JSON.stringify(new Date().toUTCString()),
				"process.env.NODE_ENV": JSON.stringify(
					args.mode === "development" ? "development" : "production"
				),
				ENV: JSON.stringify(
					args.mode === "development" ? "development" : "production"
				),
			}),
		],
		optimization: {
			minimize: !(args.hasOwnProperty("mode") && args.mode === "development"),
			runtimeChunk: "single",
			splitChunks: {
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors",
						enforce: true,
						chunks: "initial",
					},
				},
			},
		},
		devtool: false,
	};
};
