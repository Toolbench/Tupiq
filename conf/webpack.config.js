const path = require('path');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../bin/js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new ChromeExtensionReloader({
      reloadPage: true
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../bin/'),
    publicPath: 'http://localhost:8080/js/'
  }
};
