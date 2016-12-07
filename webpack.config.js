const webpack = require('webpack');
const path = require('path');
// eslint-disable-next-line
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'index.html'),
  filename: 'index.html',
  inject: 'body',
  chunks: ['main'],
});
module.exports = {
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
  },
  devtool: 'eval',
  entry: {
    'main': path.join(__dirname, 'src', 'index.jsx'),
    'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    preLoaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }],
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.ico$/,
      loader: 'file-loader?name=[name].[ext]',
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      loader: 'url-loader?limit=10000',
    }, {
      test: /\.(eot|ttf|wav|mp3|mp4|pdf)$/,
      loader: 'file-loader',
    }, {
      test: /node_modules\/.*\.css$/,
      loaders: ['style', 'css'],
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: ['style', 'css?module'],
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loaders: ['style', 'css?module', 'sass'],
    }],
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ],
  devServer: {
    inline: true,
    port: 8080,
  },
};
