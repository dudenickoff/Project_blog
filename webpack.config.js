const path = require('path');
const HtmlWebpackPlugin = require ('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require ('webpack');

const PATHS = {
	build: path.join(__dirname, 'build'),
	template: path.join(__dirname, 'template'),
	source: path.join(__dirname, 'src')
}

module.exports = {
	entry: {
		'index': PATHS.source + '/index.js'
	},
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	plugins: [ 
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'template') + '/index.html'
		}),
			new ExtractTextPlugin("style.css")
	],
	devtool: "source-map",
	module: {
		rules: [
			{ 
				test: /\.(png|svg|jpg)$/, 
				loader: 'file-loader?limit=100000',
				options: {name: '/img/[name].[ext]'}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader']
				})
			},
			{
				test: /\.html$/,
				use: ['html-loader']
			},
		]
	},
	devServer: {
		port: 3000,
		stats: "errors-only"
	}
}