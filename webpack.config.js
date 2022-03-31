const path = require('path');

module.exports = {
  entry: './src/Calx.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/, 
          /oldsrc/,
          /dist/,
        ],
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    
  },
  output: {
    filename: 'calx.js',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'umd',
  },
};