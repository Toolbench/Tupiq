const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../bin')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
          }, {
            loader: 'sass-loader'
          }]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/styles.css',
      allChunks: true
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../bin/'),
    publicPath: 'http://localhost:8080/js/'
  }
};
