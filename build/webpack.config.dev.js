const webpackConfig = require('./../webpack.config.js');
const {merge} = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")   //提取css
const os = require('os')
let netWork = os.networkInterfaces()
let host = ''
// 计算本机ip
for (let dev in netWork) {
  netWork[dev].forEach(function (details) {
    if (host === '' && details.family === 'IPv4' && !details.internal) {
      host = details.address
    }
  })
}

module.exports = merge(webpackConfig, {
  mode: 'development',
  devServer: {
    compress: true,
    port: 8989,
    hot: true,
    host: host || 'localhost',
    inline: true,
    hotOnly: true,  //当编译失败时，不刷新页面
    overlay: true,  //用来在编译出错的时候，在浏览器页面上显示错误
    publicPath: '/',  //一定要加
    open: true, //是否自动打开浏览器
    watchOptions: {
      // 不监听的文件或文件夹，支持正则匹配
      ignored: /node_modules/,
      // 监听到变化后等1s再去执行动作
      aggregateTimeout: 1000,
      // 默认每秒询问1000次
      poll: 1000
    },
    historyApiFallback: true //history 必须开启
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            }
          }, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            }
          }, 'css-loader', 'postcss-loader', 'sass-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: ['babel-loader']
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
