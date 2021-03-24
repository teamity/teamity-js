const { BannerPlugin } = require('webpack')
const version = require('./package.json').version

const banner = `Teamity v${version}
(c) 2020-${new Date().getFullYear()} beanjs
Released under the MPL-2.0.`

module.exports = {
  entry: './index.js',
  output: {
    filename: 'teamity.js',
    library: 'Teamity',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'development',
  devtool: 'source-map',
  node: false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-object-assign']
          }
        }
      }
    ]
  },
  plugins: [new BannerPlugin(banner)]
}
