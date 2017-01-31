var path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: [
		"webpack-dev-server/client?http://localhost:4000",
		"webpack/hot/only-dev-server",
		'./src/js/main.js',
		'./src/css/reset.css',
		'./src/css/main.css'
	],
	output: {
		path: './build',
		filename: '[name].js'
	},
	devtool: 'source-map',
	module: {
		loaders: [
	//		{
	//			test: /\.js$/,
	//			exclude: /node_modules/,
	//			loader: 'babel'
	//		},
			{
				test: [ /*\.less$/,*/ /\.css$/ ],
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader') // !less-loader
			},
			// {
			// 	test: /[\\\/]src[\\\/]js[\\\/]modernizr\.js$/,
   //          	loader: "imports?this=>window!exports?window.Modernizr"
			// },
			{
				test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
				loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			//title: 'App Title...',
			//inject: 'body',
			template: path.resolve(__dirname, './src/index.html'),
			// template: path.resolve(__dirname, './src/css.css')
		}),
		new BrowserSyncPlugin(
			{
				host: 'localhost',
				port: 3000,
				//server: {
				//	baseDir: ['./build']
				//}//,
				proxy: 'http://localhost:4000'
			},
			{
				callback: function () {
					console.log('BrowserSync started...');
				},
				reload: true
			}
		),
		new ExtractTextPlugin('[name].css')
	]
};
