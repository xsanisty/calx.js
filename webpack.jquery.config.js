const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/jquery.calx.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true, // Skip type checking for faster builds
          }
        },
        exclude: [
          /node_modules/,
          /legacy/,
          /oldsrc/,
          /dist/,
          /test/,
          /example.*\.ts$/,
        ],
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  externals: {
    // jQuery is expected to be loaded globally
    'jquery': 'jQuery'
  },
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: 'jquery.calx.js.map',
      exclude: ['vendor.js'],
    })
  ],
  output: {
    filename: 'jquery.calx.js',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'umd',
    globalObject: 'this'
  },
};
