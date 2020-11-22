const path = require('path'); //node 路径模块
// const webpack = require('webpack'); // webpack
const vueLoaderPlugin = require('vue-loader/lib/plugin'); // 解析vue文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html 文件压缩以及配置
const optimizeCss = require('optimize-css-assets-webpack-plugin'); // css压缩
const cssnano = require('cssnano'); // 引入cssnano配置压缩选项
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //js压缩处理，具有剔除注释、代码压缩等功能
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 清除构建产物

module.exports = {
  /*
  * 入口文件
  * 多入口是一个对象 {
  *   xxx: ''
  *   xxx: ''
  * }*/
  entry: path.resolve(__dirname, '../src/main.js'),
  /*
  * 打包输出配置
  * */
  output: {
    path: path.resolve(__dirname, '../dist'), // 打包的路径
    filename: 'js/[name].[hash:8].js', // 打包后的名字  生成8位数的hash
    chunkFilename: 'js/[name].[hash:8].js', // 异步加载模块
  },
  /*
  * 解析器配置
  * */
  module: {
    rules: [
      /*
      * js解析
      * */
      {
        test: /\.js$/,
        use: ['babel-loader','eslint-loader']
      },
      /*
      * css解析
      * */
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      /*
      * sass / scss解析
      * */
      {
        test: /\.(sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'postcss-loader']
      },
      /*
      * 文件解析 图片 字体 视频
      * */
      {
        test: /\.(jpeg|png|jpg|gif)$/i, // 图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,  //  默认true 要false图片才显示
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash:8].[ext]',
                  outputPath: 'img/'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash:8].[ext]',
                  outputPath: 'media/'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash:8].[ext]',
                  outputPath: 'font/'
                }
              }
            }
          }
        ]
      },
      /*
      * vue 文件解析*/
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
    ]
  },
  /*
  * 插件配置
  * */
  plugins: [
    /*
    * vue解析插件
    * */
    new vueLoaderPlugin(),
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
    // new CleanWebpackPlugin(),
    /*
    * scope hoisting webpack4默认打包生产环境自动开启 4以下需要自己开启
    * */
    // new webpack.optimize.ModuleConcatenationPlugin()
  ],
  /*
  * vue解析配置
  * */
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['.js', '.vue', '.json'],
  },
  /*
  * 打包优化
  * */
  optimization: {
    /*
    * 公共脚本分离
    * */
    splitChunks: {
      chunks: 'all',
      minSize: 1000,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'all'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    }
  }
}
