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
      { test: /\.css$/i, use: [{loader: "style-loader"}, {loader: "css-loader", options: {modules: false}}]}
    ]
  },
  devServer: {
    contentBase: "./dist",
  }
};