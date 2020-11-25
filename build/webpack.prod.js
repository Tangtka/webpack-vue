const path = require('path'); //node 路径模块
// const webpack = require('webpack'); // webpack
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html 文件压缩以及配置
const optimizeCss = require('optimize-css-assets-webpack-plugin'); // css压缩
const cssnano = require('cssnano'); // 引入cssnano配置压缩选项
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //js压缩处理，具有剔除注释、代码压缩等功能
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 清除构建产物
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');    // 缓存第三方模块 hard-source-webpack-plugin ，这个插件会去对比修改了哪些配置，只去打包修改过了的配置 第一次打包速度正常，第二次打包速度能提升 50%+
const CompressionWebpackPlugin = require('compression-webpack-plugin');  // g-zip压缩可以将已经压缩过的js，css再次压缩一遍，减少了打包大小，需要nginx配置
const MinifyPlugin = require("babel-minify-webpack-plugin"); //loader的时候由于文件大小通常非常大，所以会慢很多，所以这个插件有个作用，就是可以在loader的时候进行优化，减少一定的文件体积。
const HappyPack = require('happypack');     //单进程转多进程
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
const {merge} = require('webpack-merge');
const webpackConfig = require('./webpack.base')

module.exports = merge(webpackConfig, {
  /*
  * 打包环境
  * */
  mode: 'production', // development production
  module: {
    rules: [
      /*
      * js解析
      * */
      {
        test: /\.js$/,
        use: ['happypack/loader?id=happyBabel', 'eslint-loader'],
        exclude: /node_modules/,
        include: [resolve('src')]
      },
    ]
  },
  /*
  * 插件配置
  * */
  plugins: [
    /*
    * css提取配置
    * */
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[id].[contenthash:8].css",
    }),
    /*
    * html 压缩 配置
    * */
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      title: 'TK',
      icon: '/'
    }),
    /*
    * css压缩
    * */
    new optimizeCss({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano, // 引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: {removeAll: true}
      },
      canPrint: false // 是否将插件信息打印到控制台
    }),
    /*
    * js 压缩 webpack4 已内置 手动设置可配置参数*/
    // new UglifyJsPlugin({
    //   test: /\.js($|\?)/
    // }),
    /*
    * 清除构建目录
    * */
    new CleanWebpackPlugin(),
    /*
    * scope hoisting webpack4默认打包生产环境自动开启 4以下需要自己开启
    * */
    // new webpack.optimize.ModuleConcatenationPlugin(),
    new HardSourceWebpackPlugin(),
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 10240, // 只有大小大于10k的资源会被处理
      minRatio: 0.8 // 压缩比例，值为0 ~ 1
    }),
    new MinifyPlugin(),
    new HappyPack({
      id: 'happyBabel',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool: happyThreadPool
    }),
  ],
  /*
  * 打包优化
  * */
  optimization: {
    /*
    * 公共脚本分离
    * */
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  }
})
