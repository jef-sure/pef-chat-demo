var webpack = require('webpack');
var path = require('path');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, '../www-static/chat');
var APP_DIR = path.resolve(__dirname, 'src');

require('es6-promise').polyfill();

module.exports = {
    entry: {
        app: APP_DIR + '/app.jsx'
    },
    output: {
        path: BUILD_DIR,
        filename: 'main.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.html$/,
                loader: 'html',
            }, {
                test: /\.json$/,
                loader: 'json',
            }, {
                test: /bootstrap\/js\//,
                loader: 'imports?jQuery=jquery'
            }, {
                test: /\.woff(\d+)?$/,
                loader: 'url-loader?mimetype=application/font-woff'
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            }
        ]
    },
    devtool: "source-map"
//	resolveLoader : {
//		root : '/home/anton/node_modules'
//	},
//	plugins : [ new ExtractTextPlugin("app.css") ]
};

