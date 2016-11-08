const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
    jsx: "./src/index.jsx",
    css: "./src/main.css",
    html: "./src/index.html",
  },
  output: {
    path: __dirname + "/static",
    filename: "bundle.js",
  },
  plugins: [
    // Define production build to allow React to strip out unnecessary checks
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // suppresses warnings, usually from module minification
        warnings: false,
      },
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      config: path.join(__dirname, 'config', process.env.NODE_ENV || 'development')
    }
 },
  module: {
    loaders: [
      { test: /\.html$/, exclude: /node_modules/, loader: "file?name=[name].[ext]" },
      { test: /\.css$/, exclude: /node_modules/, loader: "file?name=[name].[ext]" },
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ["babel-loader"]},
    ],
  }
};
