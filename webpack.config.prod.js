const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'browserslist',
  performance: {
    hints: false,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin(), new CssMinimizerPlugin()],
  },

  entry: {
    'assets/js/vendor': './src/js/vendor.js',
    'assets/js/app': './src/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].bundel.js',
  },
  devServer: {
    compress: true,
    open: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  { useBuiltIns: 'usage', corejs: { version: 3 } },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/dist/assets/styles',
            },
          },
          'css-loader',
          'postcss-loader',
          'resolve-url-loader', // add this before sass-loader
          'sass-loader',
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        exclude: /node_modules/,
        include: [/fonts/],
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.(gif|svg|png|jpe?g)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/url/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      filename: 'index.html',
      // excludeChunks: ['assets/js/vendor'],
    }),

    new MiniCssExtractPlugin({
      filename: 'assets/styles/[contenthash].css',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new CopyPlugin({
      patterns: [{ from: './src/media/images', to: 'assets/images' }],
    }),
    new CleanPlugin.CleanWebpackPlugin(),
  ],
};
