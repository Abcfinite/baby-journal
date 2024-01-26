const path = require('path');

const nodeModulesPath = path.resolve(__dirname, '../../../../node_modules')

module.exports = {
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        use: {
          loader: 'ts-loader',
          options: { allowTsInNodeModules: true },
        },
      },
    ],
  },
  resolve: {
    modules: ['src', nodeModulesPath],
    extensions: ['.ts', '.js'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
};