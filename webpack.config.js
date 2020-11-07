const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')   //这里引入插件
const {CleanWebpackPlugin} = require('clean-webpack-plugin') //清理
const CopyWebpackPlugin = require('copy-webpack-plugin')      // 复制文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin")   //提取css
const vueLoaderPlugin = require('vue-loader/lib/plugin') //解析vue文件

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// const webpack = require('webpack')
module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),  //入口文件
  output: {
    filename: 'js/[name].[hash:8].js',   //打包后的名字  生成8位数的hash
    path: path.resolve(__dirname, 'dist'),   //打包的路径
    chunkFilename: 'js/[name].[hash:8].js',  //异步加载模块
  },
  //插件注入
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      title: 'TK',
      icon: '/'
    }),
    // new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "css/[id].css",
    }),
    new vueLoaderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader,
      //       options: {
      //         publicPath: '/',
      //       }
      //     }, 'css-loader', 'postcss-loader'],
      // },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader,
      //       options: {
      //         publicPath: '/',
      //       }
      //     }, 'css-loader', 'postcss-loader', 'sass-loader'],
      //   exclude: /node_modules/
      // },
      // {
      //   test: /\.js$/,
      //   use: ['babel-loader']
      // },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.(jpeg|png|jpg|gif)$/i, //图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,  //默认true 要false图片才显示
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
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]',
                  outputPath: 'img/'
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
                  name: 'font/[name].[hash:8].[ext]',
                  outputPath: 'img/'
                }
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json'],
  }
}
