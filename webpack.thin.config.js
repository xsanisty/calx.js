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
  externals: {
    // FormulaJS is expected to be loaded separately
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
      filename: 'calx.thin.js.map',
      exclude: ['vendor.js'],
    })
  ],
  output: {
    filename: 'calx.thin.js',
    path: path.resolve(__dirname, './dist'),
    library: 'Calx',
    libraryTarget: 'umd',
    libraryExport: 'Calx',
    globalObject: 'this'
  },
};
