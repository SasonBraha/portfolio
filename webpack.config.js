const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: { main: './src/ts/index.ts' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use:  [
          'style-loader',
           MiniCssExtractPlugin.loader,
          'css-loader?url=false',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [ 
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new WebpackMd5Hash(),
    new CopyWebpackPlugin([ { context: './src/assets/', from: '**/*', to: './assets/' } ]),
    new CopyWebpackPlugin([ { context: './src/_redirects', from: './', to: './' } ]),
  ]
};