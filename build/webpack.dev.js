const webpack = require('webpack'); // webpack
const path = require('path');
const {merge} = require('webpack-merge');
const webpackConfig = require('./webpack.base');

module.exports = merge(webpackConfig, {
  mode: 'development', // development production
  stats: 'errors-only',
  /*
  * 打包输出配置
  * */
  output: {
    path: path.resolve(__dirname, '../dist'), // 打包的路径
    filename: 'js/[name].[hash:8].js', // 打包后的名字  生成8位数的hash
    chunkFilename: 'js/[name].[hash:8].js', // 异步加载模块
  },
  /*
  * 开发环境设置
  * */
  devServer: {
    port: 3000,
    hot: true,
    host: 'localhost',
    inline: true,
    hotOnly: true,  // 当编译失败时，不刷新页面
    overlay: true,  // 用来在编译出错的时候，在浏览器页面上显示错误
    publicPath: '/',  // 一定要加
    open: true, // 是否自动打开浏览器
    watchOptions: {
      // 不监听的文件或文件夹，支持正则匹配
      ignored: /node_modules/,
      // 监听到变化后等1s再去执行动作
      aggregateTimeout: 1000,
      // 默认每秒询问1000次
      poll: 1000
    },
    historyApiFallback: true // history 必须开启
  },
  /*
  * 是否生成sourcemap
  * */
  devtool: 'source-map',
  /*
  * 插件配置
  * */
  plugins: [
    /*
    * 热更新
    * */
    new webpack.HotModuleReplacementPlugin()
  ]
})
