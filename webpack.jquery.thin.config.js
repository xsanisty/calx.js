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
            transpileOnly: true
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
    // jQuery and FormulaJS are expected to be loaded separately
    'jquery': 'jQuery',
    '@formulajs/formulajs': {
      commonjs: '@formulajs/formulajs',
      commonjs2: '@formulajs/formulajs',
      amd: '@formulajs/formulajs',
      root: 'formulajs'
    }
  },
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: 'jquery.calx.thin.js.map',
      exclude: ['vendor.js'],
    })
  ],
  output: {
    filename: 'jquery.calx.thin.js',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'umd',
    globalObject: 'this'
  },
};
