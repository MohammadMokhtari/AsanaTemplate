const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//config for all html pages in src folder
let htmlPageNames = [
  'account-address',
  'account-info',
  'account-orderList',
  'account-resetPassword',
  'account-userEdit',
  'account-userFactors',
  'account-wallet',
  'account',
  'index',
  'login',
  'product-details',
  'product-list',
  'product-list2',
  'shoppingCart',
  'signup',
];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/${name}.html`,
    filename: `${name}.html`,
    chunks: ['assets/js/app', 'assets/js/vendor'],
    hash: true,
  });
});

module.exports = {
  mode: 'development',
  target: 'web',
  entry: {
    'assets/js/vendor': './src/js/vendor.js',
    'assets/js/app': './src/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundel.js',
  },
  devServer: {
    compress: true,
    open: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  devtool: 'source-map',
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
              publicPath: '/dist/assets/',
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
