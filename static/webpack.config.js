var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react-with-addons.min.js');
var pathToReactDOM = path.resolve(node_modules, 'react-dom/dist/react-dom.min.js');

module.exports = {

    entry: {
        //'dev-server': 'webpack/hot/dev-server',
        bundle: path.resolve(__dirname, 'src/js/page/loading.js')
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: "dist/",
        filename: '[name].js',
        chunkFilename: "[chunkhash].js"
    },

    module: {
        loaders: [
            //{ test: /\.html$/,      loader: 'html' },
            { test: /\.jsx?$/,        loader: 'jsx?harmony' },
            //{ test: /\.json$/,      loader: 'json'},

            // styles
            { test: /\.css$/,       loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
            { test: /\.scss$/,      loader: ExtractTextPlugin.extract('style-loader','css-loader?sourceMap!autoprefixer-loader!sass-loader') },

            //// fonts
            { test: /\.woff$/,   loader: "url-loader?prefix=font/&limit=5000&mimetype=application/font-woff" },
            { test: /\.ttf$/,    loader: "file-loader?prefix=font/" },
            { test: /\.eot$/,    loader: "file-loader?prefix=font/" },
            { test: /\.svg$/,    loader: "file-loader?prefix=font/" },

            // images
            { test: /\.(png|jpg)$/, loader: 'url?limit=8192' }
        ],
        noParse: [ pathToReact, pathToReactDOM ]
    },

    resolve: {
        extensions: ['', '.js', '.json', '.scss'],
        alias: {
            'react': pathToReact,
            'react-dom': pathToReactDOM
        }
    },

    plugins: [
        //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')

        //new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }}),

        new ExtractTextPlugin("style.css", { allChunks: true })
    ]

};