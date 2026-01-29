const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/Calx.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        exclude: [
          /node_modules/,
          /legacy/,
          /oldsrc/,
          /dist/,
          /test/,
          /example.*\.ts$/
        ],
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: 'calx.esm.js.map',
      exclude: ['vendor.js'],
    })
  ],
  output: {
    filename: 'calx.esm.js',
    path: path.resolve(__dirname, './dist'),
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
};
