const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}, 
      { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      { test: /\.(woff|woff2|eot|ttf|otf|jpg|png)$/,  loader: "file-loader"},
      { test: /\.css$/i, use: [{loader: "style-loader"}, {loader: "css-loader", options: {modules: false}}]}
    ]
  },
  devServer: {
    contentBase: "./dist",
  }
};